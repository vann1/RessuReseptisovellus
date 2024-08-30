const express = require("express");
const { isJson } = require("../utils/requestUtils");
const router = express.Router();
const {changePassword, createUser, loginUser, showUser, showAllUsers, deleteUser , getUserRecipe} = require("../controllers/user");
const { badRequest, notFound, ok , internalServerError} = require("../utils/responseUtils");
const {requireAuth} = require('../middlewares/authMiddleware');


/**
 *
 * Handles POST request to create a new user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user creation process is complete.
 */
//Creates user
router.post("/create", async (req, res) => {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  //If it was, the user.createUser(req, res) function is returned.
  return createUser(req, res);
});
const maxAge = 60 * 60 * 1000;

/**
 * Handles POST request to login a user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user login process is complete.
 */
//Used in user log in
router.post("/login", async (req, res) => {
  const {email} = req.body;
  try {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  //If it was, the user.loginUser(req, res) function is returned.
  const details = await loginUser(req,res,maxAge);
  if (!details) {
    return notFound(res, "User not found in the database");
  } else {
    res.status(200).json({email: email, token: details.token, userid: details.user.userid,role: details.user.ROLE})
  }
} catch (err){
  return internalServerError(res, "Internal server error: " + err)
}
});
//after this all routes requires authenticated user
router.use(requireAuth);

//Users info
router.post("/profile", async (req, res) => {
  try {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return showUser(req,res);
} catch (err){
  return internalServerError(res, "Internal server error: " + err)
}
});

//Admin info
router.get("/admin", async (req, res) => {
  try {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return showAllUsers(req,res);
} catch (err){
  return internalServerError(res, "Internal server error: " + err)
}
});

//Deletes user using userid
router.delete('/:userId', (req,res) => {
  const userid = req.params.userId;
  try {
    //First, it checks if the received request was in JSON format or not.
    if (!isJson(req)) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return deleteUser(res, userid);
  }
  catch (err){
    return internalServerError(res, "Internal server error: " + err)
  }

})

//Gets user info using userid
router.get('/profile/:userId', (req,res) => {
  try {
    //First, it checks if the received request was in JSON format or not.
    if (!isJson(req)) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return getUserRecipe(req,res);
  }
  catch (err){
    return internalServerError(res, "Internal server error: " + err)
  }

})

//Used in password change
router.post("/password/change", async (req, res) => {
  try {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  //checks if the given password is matching
  return changePassword(req, res);

} catch (err){
  return internalServerError(res, "Internal server error: " + err)
}
});
module.exports = router;
