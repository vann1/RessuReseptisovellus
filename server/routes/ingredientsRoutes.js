const express = require('express');
const {badRequest} = require("../utils/responseUtils")
const {isJson} = require('../utils/requestUtils')
const sql = require('mssql');
const config = require('../config/config');
const router = express.Router();
const {getIngredients, addIngredient, deleteIngredient} = require("../controllers/ingredients")
const {requireAuth} = require('../middlewares/authMiddleware')

//Searches ingredients using recipeid
router.get('/:recipeId', async (req, res) => {
  if(!isJson) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return getIngredients(req, res);
});

router.use(requireAuth);
//after this all routes requires authenticated user
//Adds ingredient
router.post('/add', async (req, res) => {
  if(!isJson) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return addIngredient(req, res);
});
//Deletes ingredient using ingredientid
router.delete('/:ingredientId', async (req, res) => {
  if(!isJson) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return deleteIngredient(req, res);
});









module.exports = router;