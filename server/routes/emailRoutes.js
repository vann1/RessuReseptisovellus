const express = require('express');
const router = express.Router();
const {requireAuth} = require('../middlewares/authMiddleware');
const {isJson} = require('../utils/requestUtils')
const {sendEmail} = require('../controllers/email');
const {sendPasswordRecoveryEmail } = require('../controllers/email');

// router.use(requireAuth);

//Used in recovering password
  router.post('/recover', async (req, res) => {
    try {
      const { email } = req.body;  
      // Calls the function to send password recovery email
      const success = await sendPasswordRecoveryEmail(email);
  
      if (success) {
        res.status(200).json({ message: 'Password recovery email sent successfully' });
      } else {
        res.status(404).json({ error: 'Email not registered' });
      }
    } catch (error) {
      console.error('Error sending password recovery email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.use(requireAuth); 
  //after this all routes requires authenticated user
//Used in sharing a recipe through email
  router.post('/send', async (req, res) => {
    if(!isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return sendEmail(req,res);
  });

module.exports = router;