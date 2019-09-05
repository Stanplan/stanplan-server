var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: new Date()
  },
  likes: {
    type: [String], // Array of user IDs
    default: []
  }
})

var PostSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: [String], // Array of user IDs
    default: []
  },
  comments: {
    type: [CommentSchema],
    default: []
  }
});

module.exports = PostSchema;
