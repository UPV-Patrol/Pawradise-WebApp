//DESCRIPTION:c ontains config for validating email and passowrd

const validator = require('validator');
const db = require('../config/db'); 

exports.validateSignup = async (req, res, next) => {
    let { username, email, password, confirmPassword } = req.body;

    //initial check if fields are empty
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please complete the fill up.." });
    }

    //  --- VERIFY EMAIL ---
    req.body.email = validator.normalizeEmail(email, { gmail_remove_dots: false }); //clean email by removing spaces and turning to lowercase
    const cleanEmail = req.body.email;

    if (!validator.isEmail(cleanEmail)) {
        return res.status(400).json({ message: "Invalid email. Enter a valid email address" });
    }

    //check if email exists
    const [existing_email] = await db.query('SELECT * FROM user WHERE email = ?', [cleanEmail]);
    if (existing_email.length > 0) {
        return res.status(400).json({ message: "Email already exist" });
    }

    // --- VALIDITY OF PW THAT MUST BE MET ---
    const isStrongPassword = validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        returnScore: false
    });
    //display req for pw
    if (!isStrongPassword) {
        return res.status(400).json({
            message: "Password  does not meet requirements."
        });
    }

    //check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }

    // pass control to the signup controller
    next(); 
};