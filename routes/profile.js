var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

router.get('/profile', (req, res) => {
  if (req.session.user === undefined) {
    res.sendStatus(400);
  }

  UserController.getUserByID(req.session.user).then(user => {
    res.status(200).json({ id: user.id, name: `${user.firstName} ${user.lastName}`, bio: user.bio });
  });
})

module.exports = router;
