var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var UserController = require('../controllers/UserController');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_STANPLAN,
    pass: process.env.GMAIL_STANPLAN_PASSWORD
  }
});

router.post('/signup', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let gender = req.body.gender;
  let phone = req.body.phone;
  let university = req.body.university;

  if (email === null || email.length < 1) {
    return res.status(400).json({ error: 'Email not found' });
  }
  if (password === null || password.length < 1) {
    return res.status(400).json({ error: 'Password not found' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password weak' });
  }
  if (firstName === null || firstName.length < 1) {
    return res.status(400).json({ error: 'First name not found' });
  }
  if (lastName === null || lastName.length < 1) {
    return res.status(400).json({ error: 'Last name not found' });
  }
  if (gender !== 'Male' && gender !== 'Female' && gender !== 'Non-binary' &&
      gender !== 'Other' && gender !== 'Prefer not to say') {
    return res.status(400).json({ error: 'Gender not found' });
  }
  if (university !== 'Stanford University') {
    return res.status(400).json({ error: 'University not found' });
  }
  console.log('Signing up: ' + email);

  UserController.isEmailTaken(email).then(taken => {
    if (taken) {
      return res.status(400).json({ error: 'Email already taken' });
    }
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        return res.status(500).json({ error: 'An internal error occurred while hashing the password' });
      }
      UserController.createUser(email, hash, firstName, lastName, gender, phone, university).then(id => {
        console.log("Successfully created new user: " + req.body.email);

        // TODO: Add confirmation email functionality
        /*var mailOptions = {
          from: 'stanplan294@gmail.com',
          to: email,
          subject: 'StanPlan: Confirm your email address',
          html: '<p>Welcome to StanPlan!</p>' +
                '<br/>' +
                '<p>Click the button below to confirm that you are the owner of this ' +
                'email address.</p>' +
                '<br/>' +
                '<button type="button">Confirm email</button>' +
                '<br/>' +
                '<p>Best,</p>' +
                '<p>The StanPlan Team</p>'
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });*/

        res.sendStatus(200);
      });
    });
  });
})

router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (email === null || email.length < 1) {
    return res.status(400).json({ error: 'Email not found' });
  }
  if (password === null || password.length < 1) {
    return res.status(400).json({ error: 'Password not found' });
  }
  console.log('Logging in: ' + email);

  UserController.getUserByEmail(email).then(user => {
    if (!user) {
      return res.status(400).json({ error: 'No user exists with this email' });
    }
    bcrypt.compare(password, user.hash, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'An internal error occurred while hashing the password' });
      }
      if (!result) {
        return res.status(400).json({ error: 'The provided password is incorrect' });
      }
      req.session.user = user.id;
      console.log('Successfully logged in user: ' + req.body.email);
      res.sendStatus(200);
    });
  });
})

router.post('/logout', (req, res) => {
  console.log('Logging out: ' + req.session.user);
  req.session.destroy();
  res.sendStatus(200);
})

module.exports = router;
