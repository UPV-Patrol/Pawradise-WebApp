//DESCRIPTION: handles all logic of users


//IMPORTS
const db = require('../src/config/db'); //connect db
//import third-party mod
const bcrypt = require('bcrypt'); //for hashing pw
const validator = require('validator');

const num_of_hashing = 10; //performs 2^10 hashing, slower to decrypt later = lesser being hacked

//for test 
db.query('SELECT * FROM user LIMIT 1').then(([rows]) => {
    console.log("schema:", rows[0]);
});

// SIGNUP
// after passing in middleware: validateSignUp for email and pw check
exports.signup = async (req, res) => {
    const { username, email, password } = req.body; 

    try {
        const hashedPassword = await bcrypt.hash(password, num_of_hashing); 
        await db.query(
            'INSERT INTO user (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword] 
        );
        // direct back to home res.redirect('/home.html'); 
        return res.status(200).json({ success: true, redirect: '/home.html' }); // had to turn this into json instead of only redirecting
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

//LOGIN
exports.login = async (req, res) => {

    let { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    try {
        email = validator.normalizeEmail(email, { gmail_remove_dots: false });   // lowercase and remove unnecessary space

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email. Enter a valid email address" });
        }
        //check if email was saved 
        const [existing] = await db.query(
            'SELECT * FROM user WHERE email = ?', [email]
        );

        //test
        console.log("this works TT"); 

        if (existing.length === 0) {
            return res.status(400).json({ message: "Email not found"});
        }

        //if email was found
        const user = existing[0]; 

        console.log("Plaintext typed password:", password);
        console.log("Hashed password found in DB row:", user.password);

        //check if pw match from registered one 
        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        //saves the userId session.
        req.session.userId = existing[0].user_id;
        req.session.isLoggedIn = true;
        req.session.role = user.role;

        //saving since redirection may go first before saving sessionh haha
        req.session.save(()=> {
            // res.redirect('/home.html'); 
            return res.status(201).json({ success: true, redirect: '/home.html' });     // had to turn this into json instead of only redirecting
        });
    //TODO: might add something that stays in the login and highlight the one that is wrong
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
