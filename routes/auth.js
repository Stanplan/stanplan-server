var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var sgMail = require('@sendgrid/mail');
var UserController = require('../controllers/UserController');
var UnverifiedUserController = require('../controllers/UnverifiedUserController');
var { generateRandomAlphanumericString } = require('../utils/random');
var { generateRegistrationEmail } = require('../assets/emails/registration_email');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const MIN_PASSWORD_LENGTH = 6;
const COMMON_PASSWORDS = ['123456', '1234567', '12345678', '123456789', '1234567890',
'password', '111111', 'sunshine', 'letmein', 'qwerty', 'iloveyou', 'princess', 'admin',
'welcome', '666666', 'abc123', 'football', '123123', 'monkey', '654321', '!@#$%^&*',
'!@#$%^&', '!@#$%^', 'charlie', 'aa123456', 'donald', 'password1', 'qwerty123',
'starwars', 'dragon', 'passw0rd', 'master', 'stanplan', 'stanford', 'berkeley',
'university', 'freedom', 'whatever', 'qazwsx', 'trustno1', 'flower', '121212',
'hottie', 'loveme', 'zaq1zaq1', 'baseball', '1qaz2wsx', 'qwertyuiop', 'adobe123',
'photoshop', 'ashley', 'bailey', 'mustang', 'access', 'shadow', 'michael',
'superman', 'batman', 'azerty', '987654321', '87654321', '7654321', '0987654321',
'mynoob', '18atcskd2w', '777777', '7777777', '1q2w3e4r', '555555', '444444', '333333',
'222222', '111111', '000000', '999999', '888888', '3rjs1la7qe', 'tafuna123',
'1q2w3e', '1q2w3e4r5t', 'ilovekimora', 'superman2231', 'bebepogi', 'planstan', '123abc'];
const GENDER_OPTIONS = ['male', 'female', 'non-binary', 'other', 'prefer not to say'];
const UNIVERSITY_OPTIONS = ['stanford university'];
const NAME_REGEX = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s'.-]+$/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_NUMBER_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

function isEmailValid(email, errors) {
  if (email === null || email.length < 1) {
    errors.push('Email not found');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Invalid email entered');
  }
  return errors;
}

function isPasswordValid(password, errors) {
  if (password === null || password.length < 1) {
    errors.push('Password not found');
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  } else if (COMMON_PASSWORDS.indexOf(password) >= 0) {
    errors.push(`That password is too common`);
  }
  return errors;
}

function isFirstNameValid(firstName, errors) {
  if (firstName === null || firstName.length < 1) {
    errors.push('First name not found');
  } else if (!NAME_REGEX.test(firstName)) {
    errors.push('First name uses invalid characters');
  }
  return errors;
}

function isLastNameValid(lastName, errors) {
  if (lastName === null || lastName.length < 1) {
    errors.push('Last name not found');
  } else if (!NAME_REGEX.test(lastName)) {
    errors.push('Last name uses invalid characters');
  }
  return errors;
}

function isGenderValid(gender, errors) {
  if (GENDER_OPTIONS.indexOf(gender.toLowerCase()) < 0) {
    errors.push('Gender not found');
  }
  return errors;
}

function isPhoneNumberValid(phoneNumber, errors) {
  if (phoneNumber === null || phoneNumber.length < 1) {
    return errors; // End validation early because phone number is optional
  } else if (!PHONE_NUMBER_REGEX.test(phoneNumber)) {
    errors.push('Invalid phone number entered');
  }
  return errors;
}

function isUniversityValid(university, errors) {
  if (UNIVERSITY_OPTIONS.indexOf(university.toLowerCase()) < 0) {
    errors.push('University not found');
  }
  return errors;
}

/*
 * Step 1: Check if the data provided at signup is valid.
 * Step 2: Check if the email address provided by the user is already in use.
 * Step 3: Hash the password. Store the hash and the user's signup data in the database.
 * Step 4: Send an activation email to the user's email address. The user can't log in until they activate their account.
 *
 * TODO: Set up SendGrid with our DNS host. Activation emails can't be sent until this is set up.
 */
router.post('/signup', (req, res) => {
  let { email, password, firstName, lastName, gender, phone, university } = req.body;

  let errors = [];
  errors = isEmailValid(email, errors);
  errors = isPasswordValid(password, errors);
  errors = isFirstNameValid(firstName, errors);
  errors = isLastNameValid(lastName, errors);
  errors = isGenderValid(gender, errors);
  errors = isPhoneNumberValid(phone, errors);
  errors = isUniversityValid(university, errors);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }

  UserController.isEmailTaken(email).then(taken => {
    if (taken) {
      return res.status(400).json({ errors: ['Email already taken'] });
    }
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        return res.status(500).json({ errors: ['An internal error occurred while hashing the password'] });
      }
      UserController.createUser(email, hash, firstName, lastName, gender, phone, university).then(id => {

        let confirmationString = generateRandomAlphanumericString(16);
        bcrypt.hash(confirmationString, 10, function (err, confirmationHash) {
          if (err) {
            return res.status(500).json({ errors: ['An internal error occurred while hashing the confirmation string'] });
          }
          UnverifiedUserController.createUnverifiedUser(email, confirmationHash).then(() => {
            let verificationURL = process.env.WEB_DOMAIN + `/verified?email=${email}&confirmationString=${confirmationString}`;
            const msg = {
              to: email,
              from: 'support@stanplan.com',
              subject: 'Stanplan: Activate your account',
              html: generateRegistrationEmail(`${firstName} ${lastName}`, verificationURL),
            };
            sgMail.send(msg);

            res.sendStatus(200);
          });
        });
      });
    });
  });
})

/*
 * Step 1: Check if the data provided at login is valid.
 * Step 2: Check if the login credentials are linked to a user's account.
 * Step 3: Check if the user's account is activated (if their email address is verified).
 * Step 4: If all checks pass, then set the current session to the user's ID.
 */
router.post('/login', (req, res) => {
  let { email, password } = req.body;

  let errors = [];
  errors = isEmailValid(email, errors);
  errors = isPasswordValid(password, errors);
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }

  UserController.getUserByEmail(email).then(user => {
    if (!user) {
      return res.status(400).json({ errors: ['No user exists with this email'] });
    }
    bcrypt.compare(password, user.hash, (err, result) => {
      if (err) {
        return res.status(500).json({ errors: ['An internal error occurred while hashing the password'] });
      }
      if (!result) {
        return res.status(400).json({ errors: ['The provided password is incorrect'] });
      }
      if (!user.verified) {
        return res.status(400).json({ errors: ['Your email address is not yet verified.'] });
      }
      req.session.user = user.id;
      res.sendStatus(200);
    });
  });
})

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
})

router.post('/verify', (req, res) => {
  let { email, confirmationString } = req.body;

  UnverifiedUserController.getUnverifiedUserByEmail(email).then(unverifiedUser => {
    if (!unverifiedUser) {
      return res.status(400).json({ errors: ['No unverified user exists with this email'] });
    }
    bcrypt.compare(confirmationString, unverifiedUser.confirmationHash, (err, result) => {
      if (err) {
        return res.status(500).json({ errors: ['An internal error occurred while hashing the confirmation string'] });
      }
      if (!result) {
        return res.status(400).json({ errors: ['The provided confirmation string is incorrect'] });
      }
      UnverifiedUserController.removeUnverifiedUser(email).then(() => {
        UserController.verifyUserByEmail(email).then(() => {
          res.session.user = user.id;
          res.sendStatus(200);
        });
      });
    });
  });
})

module.exports = {
  isEmailValid,
  isPasswordValid,
  isFirstNameValid,
  isLastNameValid,
  isGenderValid,
  isPhoneNumberValid,
  isUniversityValid,
  router
};
