var User = require('../models/User');
var generateID = require('../utils/id');

async function post (userID, text) {
  let id = await generateID(User);

  return await User.updateOne(
    { id: userID },
    { $push: { posts: { id: id, text: text } } }
  );
}

async function like (postUserID, postID, userID) {
  let postExists = await User.exists({
    id: postUserID,
    posts: {
      $elemMatch: {
        id: postID
      }
    }
  });
  if (postExists === false) {
    return false;
  }

  let likeExists = await User.exists({
    id: postUserID,
    posts: {
      $elemMatch: {
        id: postID,
        likes: {
          $elemMatch: {
            id: userID
          }
        }
      }
    }
  });
  if (likeExists) {
    return false; // User can't like post twice
  }

  await User.mapReduce({
    map: function() {
      emit(
        this.id,
        this['posts']
          .map( f => f.id )
          .indexOf(postID) 
      )
    },
    reduce: function() {},
    query: { "posts.id": postID }
  });

 $push: { posts: { id: id, text: text } } }
  await User.updateOne(
    {
      id: postUserID,
      posts: {
        $elemMatch: {
          id: postID
        }
      }
    },
    {
      $push: { }
    }
  );
}

module.exports = {
  post,
  like
};
