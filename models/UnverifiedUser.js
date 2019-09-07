var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UnverifiedUserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  confirmationHash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

var UnverifiedUser = mongoose.model('UnverifiedUser', UnverifiedUserSchema);

module.exports = UnverifiedUser;
