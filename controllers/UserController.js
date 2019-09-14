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
    gender: gender.toLowerCase(),
    phone: phone,
    university: university.toLowerCase(),
    verified: false
  });

  user.save(function(err) {
    if (err) console.error(err);
  });
  return id;
}

async function verifyUserByEmail (email) {
  await User.updateOne({ email: email }, { verified: true }, (err, res) => {
    if (err) console.error(err);
  });
}

const profileFields = ['bio', 'gender', 'city', 'state', 'country', 'currentResidence', 'classYear', 'majors', 'minors', 'clubs', 'interests', 'jobs', 'website'];

async function updateProfileField (id, field, value) {
  if (profileFields.indexOf(field) < 0) {
    throw(new Error('This profile field either cannot be updated or does not exist: ' + field));
  }
  await User.updateOne({ id: id }, { [field]: value }, (err, res) => {
    if (err) console.error(err);
  });
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
  updateProfileField,
  verifyUserByEmail,
  getAllUsers,
  getUserByID,
  getUserByEmail,
  isEmailTaken
};
