var User = require('../models/User');
var generateID = require('../utils/id');

async function createUser (email, hash, firstName, lastName, gender, phone, university) {
  let id = await generateID(User);

  var user = new User({
    id: id,
    email: email,
    hash: hash,
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    phone: phone,
    university: university,
    verified: false
  });

  user.save(function(err) {
    if (err) console.error(err);
  });
  return id;
}

async function post (userID, text) {
  let id = await generateID(User);

  return await User.updateOne(
    { id: userID },
    { $push: { posts: { id: id, text: text } } }
  );
}

async function getAllUsers () {
  return await User.find({}, (err, users) => {
    if (err) {
      console.error(err);
      return null;
    }
    return users;
  });
}

async function getUserByID (id) {
  return await User.findOne({ id: id }, (err, user) => {
    if (err) {
      console.error(err);
      return null;
    }
    return user;
  });
}

async function getUserByEmail (email) {
  return await User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.error(err);
      return null;
    }
    return user;
  });
}

async function isEmailTaken (email) {
  return await User.countDocuments({ email: email }, (err, count) => {
    if (err) {
      console.error(err);
      return true;
    }
    return count > 0;
  });
}

module.exports = {
  createUser,
  post,
  getAllUsers,
  getUserByID,
  getUserByEmail,
  isEmailTaken
};
