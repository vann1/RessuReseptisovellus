const {internalServerError, notFound, ok} = require('../utils/responseUtils')
const {} = require('../database')
const { isEmailRegistered } = require('../database');
const { addPasswordToDatabase } = require('../database');
const nodemailer = require("nodemailer");
require("dotenv").config();

//Function for sharing recipe via email
const sendEmail = async (req,res) => {
    const {recipePageAddress, senderEmail, reciverEmail} = req.body;
    
    try {
        //sets options for nodemailer
    const mailOptions = {
        from: senderEmail,
        to: reciverEmail,
        subject: 'Ressu Reseptisovellus',
        text: `Käyttäjä ${senderEmail} jakoi reseptin sinulle. Katsele reseptiä tästä osoitteesta ${recipePageAddress}`
    };
    //nodemailer config
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'ressureseptisovellus@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Virhe sähköpostin lähetyksessä 1:', error);
            return internalServerError(res, "Sähköpostin lähetys epäonnistui");
        } else {
            console.log('Sähköposti lähetetty:', info.response);
            return ok(res, "Sähköposti lähetetty onnistuneesti");
        }
    });
    }catch (error) {
        console.error('Virhe sähköpostin lähetyksessä:', error);
        return internalServerError(res, "Sähköpostin lähetys epäonnistui");
    }
}

//Used to recover password
async function sendPasswordRecoveryEmail(email) {
    try {
        const isRegistered = await isEmailRegistered(email); // Checks if inserted email can be found in our database
        if (!isRegistered) {
            console.log('Email is not registered');
            return false; 
        }

        // Generates new random password to user
        const newPassword = generateRandomPassword();

        // Adds the new password to database
        await addPasswordToDatabase(email, newPassword);

        // Sends the new password to email user has inserted (in case it exists in our database)
        const mailOptions = {
            from: 'ressureseptisovellus@gmail.com',
            to: email,
            subject: 'Password Recovery',
            text: `Väliaikainen salasanasi on ${newPassword}. Vaihda salasana uuteen profiili sivulla.`, 
        };

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'ressureseptisovellus@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail(mailOptions);
        console.log('Password recovery email sent successfully');
        return true; 
    } catch (error) {
        console.error('Error sending password recovery email:', error);
        throw error; 
    }
}

//Used to generate random password
function generateRandomPassword() { // function to generate random password
    const randomString = Math.random().toString(36).slice(-8);
    return randomString;
}

module.exports = {sendEmail, sendPasswordRecoveryEmail}