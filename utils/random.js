const ALPHANUMERIC_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

function generateRandomAlphanumericCharacter() {
  let index = Math.floor(Math.random() * ALPHANUMERIC_CHARACTERS.length);
  return ALPHANUMERIC_CHARACTERS.charAt(index);
}

function generateRandomAlphanumericString(length) {
  if (length === null || length === undefined) {
    return null;
  }
  let string = '';
  for (let i = 0; i < length; i++) {
    string += generateRandomAlphanumericCharacter();
  }
  return string;
}

module.exports = {
  generateRandomAlphanumericCharacter,
  generateRandomAlphanumericString
};
