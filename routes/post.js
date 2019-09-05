var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

router.post('/post', (req, res) => {
  let text = req.body.text;

  if (text === null || text.length < 1) {
    return res.status(400).json({ error: 'Text not found' });
  }

  UserController.post(req.session.user, text).then(() => {
    res.sendStatus(200);
  });
})

router.get('/posts', (req, res) => {
  if (req.session.user === undefined) {
    res.sendStatus(400);
  }

  UserController.getUserByID(req.session.user).then(user => {
    res.status(200).json({ firstName: user.firstName, lastName: user.lastName, picture: user.picture, posts: user.posts });
  })
})

module.exports = router;
