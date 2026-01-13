const validator = require("validator");

function validateEmail(email) {
  return validator.isEmail(email); // returns true or false
}

function validatePassword(password) {
  // Standard password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
}

module.exports = { validateEmail, validatePassword };
