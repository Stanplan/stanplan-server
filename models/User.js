var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PostSchema = require('./PostSchema');

var UserSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birthday: {
    type: String
  },
  phone: {
    type: String
  },
  university: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String
  },
  posts: {
    type: [PostSchema],
    default: []
  },
  classYear: {
    type: Number
  },
  majors: {
    type: [String],
    default: []
  },
  minors: {
    type: [String],
    default: []
  },
  clubs: {
    type: [String],
    default: []
  },
  interests: {
    type: [String],
    default: []
  },
  hometown: {
    type: String
  },
  currentResidence: {
    type: String
  },
  jobs: {
    type: [String],
    default: []
  },
  website: {
    type: String
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
