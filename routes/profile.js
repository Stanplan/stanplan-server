var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

router.get('/profile', (req, res) => {
  if (req.session.user === undefined) {
    res.sendStatus(400);
  }

  UserController.getUserByID(req.session.user).then(user => {
    res.status(200).json({ name: `${user.firstName} ${user.lastName}`, bio: user.bio, picture: user.picture });
  });
})

module.exports = router;
