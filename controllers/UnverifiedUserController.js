var UnverifiedUser = require('../models/UnverifiedUser');

async function createUnverifiedUser (email, confirmationHash) {
  var unverifiedUser = new UnverifiedUser({
    email: email,
    confirmationHash: confirmationHash
  });

  unverifiedUser.save(function(err) {
    if (err) console.error(err);
  });
}

async function getUnverifiedUserByEmail (email) {
  return await UnverifiedUser.findOne({ email: email }, (err, unverifiedUser) => {
    if (err) {
      console.error(err);
      return null;
    }
    return unverifiedUser;
  });
}

async function removeUnverifiedUser (email) {
  await UnverifiedUser.deleteOne({ email: email }, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  createUnverifiedUser,
  getUnverifiedUserByEmail,
  removeUnverifiedUser
};
