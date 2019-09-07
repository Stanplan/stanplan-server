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
