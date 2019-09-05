var uuid = require('uuid/v4');

async function isCollision(model, id) {
  return await model.countDocuments({ id: id }, (err, count) => {
    if (err) {
      console.error(err);
      return true;
    }
    return count > 0;
  });
}

/*
 * Generates a unique random 128-bit ID
 */
async function generateID(model) {
  let id = null;
  let collision = true;
  while (collision) {
    id = uuid();
    collision = await isCollision(model, id);
  }
  return id;
}

module.exports = generateID;
