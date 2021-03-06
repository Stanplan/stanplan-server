var uuid = require('uuid/v4');

/*
 * Checks if a document exists with the given ID already.
 * Only used internally by the generateID function.
 */
async function isCollision (model, id) {
  return await model.countDocuments({ id: id }, (err, count) => {
    if (err) {
      console.error(err);
      return true;
    }
    return count > 0;
  });
}

/*
 * Generates a unique random 128-bit ID.
 * ID is generated by the uuid library.
 */
async function generateID (model) {
  let id = null;
  let collision = true;
  while (collision) {
    id = uuid();
    collision = await isCollision(model, id);
  }
  return id;
}

module.exports = generateID;
