var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

router.get('/profile', (req, res) => {
  if (req.session.user === undefined) {
    res.sendStatus(400);
  }

  UserController.getUserByID(req.session.user).then(user => {
    res.status(200).json({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      bio: user.bio,
      university: user.university,
      classYear: user.classYear,
      majors: user.majors,
      minors: user.minors,
      clubs: user.clubs,
      interests: user.interests,
      hometown: user.hometown,
      currentResidence: user.currentResidence,
      jobs: user.jobs,
      website: user.website
    });
  });
})

router.post('/updateprofile', (req, res) => {
  if (req.session.user === undefined) {
    res.sendStatus(400);
  }

  UserController.updateProfileField(req.session.user, req.body.field, req.body.value).then(() => {
    res.sendStatus(200);
  });
})

module.exports = router;
