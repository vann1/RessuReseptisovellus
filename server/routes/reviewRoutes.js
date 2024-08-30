const express = require('express');
const {badRequest} = require("../utils/responseUtils")
const {isJson} = require('../utils/requestUtils')
const sql = require('mssql');
const config = require('../config/config');
const router = express.Router();
const {searchReviews, addReview, editReview, deleteReview} =require("../controllers/review")



//Searches reviews using recipeid
router.get('/search/:recipeid', async (req, res) => {
    if(!isJson) {
    return badRequest(res, "Content was not Json");
    }
    return searchReviews(req, res);
  });

  //Searches users reviews where review has favorite = 1 using userid
  router.get('/favorites/:userid', async (req, res) => {
    if(!isJson) {
    return badRequest(res, "Content was not Json");
    }
    return searchReviews(req, res);
  });

  //Adds review
router.post('/add', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return addReview(req, res);
  
}); 

//Edits review
router.post('/edit', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return editReview(req, res);
  
});

//Deletes review using reviewid
router.delete('/delete/:reviewid', async (req, res) => {
    
  if(!isJson) {
     return badRequest(res, "Content was not Json");
  }
  return deleteReview(req, res);
   
});







module.exports = router;