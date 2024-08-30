const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { unauthorized } = require("../utils/responseUtils");
function validatePassword(password) {
  // Check for at least 8 characters
  if (password.length < 8) {
    return false;
  }

  // Check for at least one uppercase letter
  let uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(password)) {
    return false;
  }

  // Check for at least one number
  var numberRegex = /\d/;
  if (!numberRegex.test(password)) {
    return false;
  }

  // All conditions met
  return true;
}

function validateName(name) {
  if (name === "") {
    return false;
  }
  return true;
}
function validateUsername(username) {
  if (username === "") {
    return false;
  }
  return true;
}
function validateEmail(email) {
  // Regular expression pattern for a basic email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test if the provided email matches the pattern
  var isValid = emailRegex.test(email);
  if (!isValid) {
    return false;
  }
  return true;
}

/**
 * Validates user information.
 * @param {string} username - The username to validate.
 * @param {string} email - The email to validate.
 * @param {string} password - The password to validate.
 * @param {string} name - The name to validate.
 * @returns {boolean} Returns true if all validations pass, otherwise false.
 */
function validateUser(username, email, password, name) {
  const isnameValid = validateName(name);
  const isPasswordValid = validatePassword(password);
  const isEmailValid = validateEmail(email);
  const isusernameValid = validateUsername(username);

  // Check if all validations are true
  if (isPasswordValid && isnameValid && isusernameValid && isEmailValid) {
    return true;
  } else {
    return false;
  }
}


const comparePassword = async (req, res, user) => {
  //First the function gets the user password from req.body.
  const { password } = req.body;
  //Then it compares the crypted password from database to req.body password.
  return await bcrypt.compare(password, user.password);
};
//created jwt token
const createJWT = (id, maxAge) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports = {validatePassword, validateUser, createJWT, comparePassword };
