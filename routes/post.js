var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');
var PostController = require('../controllers/PostController');

router.post('/post', (req, res) => {
  if (req.session.user === undefined) {
    res.sendStatus(400);
  }

  let text = req.body.text;

  if (text === null || text.length < 1) {
    return res.status(400).json({ error: 'Text not found' });
  }

  PostController.post(req.session.user, text).then(() => {
    res.sendStatus(200);
  });
})

async function preparePostData(posts) {
  let newPosts = JSON.parse(JSON.stringify(posts));
  for (let i = 0; i < newPosts.length; i++) {
    let user = await UserController.getUserByID(newPosts[i].owner);
    newPosts[i].firstName = user.firstName;
    newPosts[i].lastName = user.lastName;
  }
  return newPosts;
}

router.get('/posts', (req, res) => {
  if (req.session.user === undefined) {
    res.sendStatus(400);
  }

  UserController.getUserByID(req.session.user).then(user => {
    let posts = [];

    let lastDownloadTime = req.query.lastDownloadTime;
    if (lastDownloadTime === 'null') { // null parameter is stringified by query string
      posts = user.posts;
    } else {
      for (let i = 0; i < user.posts.length; i++) {
        if (new Date(user.posts[i].timestamp) - new Date(lastDownloadTime) > 0) {
          posts.push(user.posts[i]);
        }
      }
    }

    if (posts.length > 0) {
      preparePostData(posts).then(newPosts => {
        res.status(200).json({ posts: newPosts });
      });
    } else {
      res.status(200).json({ posts: [] });
    }
  })
})

router.post('/like', (req, res) => {
  if (req.session.user === undefined) {
    res.sendStatus(400);
  }

  let { postUserID, postID } = req.body;

  PostController.like(postUserID, postID, req.session.user)
  .then(() => {
    res.status(200).json({});
  })
})

module.exports = router;
