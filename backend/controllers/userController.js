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

        //saves the userId session
        req.session.userId = existing[0].user_id;
        req.session.isLoggedIn = true;
        req.session.role = user.role; //for checkin if user or admin

        //redirect base on rolw
        req.session.save(() => {
            res.status(200).json({
                success: true,
                user: {
                    username: user.username,
                    role: user.role
                }
            });
        });
    //TODO: might add something that stays in the login and highlight the one that is wrong
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};


//get sponsorships belonging to the logged in user only
exports.getMySponsorship = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                sponsor_id,
                sponsor_type,
                target_pets,
                sponsorship_month,
                amount,
                proof_img,
                status,
                created_at
             FROM sponsorship 
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [req.session.userId]
        );

        return res.status(200).json({ success: true, data: rows });

    } catch (err) {
        console.error("Get my sponsorships error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// TODO: get all favorited animals of the logged in user
exports.getFavorites = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM favorite WHERE user_id = ?',
            [req.session.userId]
        );
        return res.status(200).json({ success: true, data: rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// TODO: add an animal to favorites
exports.addFavorite = async (req, res) => {
    const { animalId } = req.body;

    try {
        // check if alr favorited to avoid duplicates
        const [existing] = await db.query(
            'SELECT * FROM favorite WHERE user_id = ? AND animal_id = ?',
            [req.session.userId, animalId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "Already in favorites" });
        }

        await db.query(
            'INSERT INTO favorite (user_id, animal_id) VALUES (?, ?)',
            [req.session.userId, animalId]
        );

        return res.status(201).json({ success: true, message: "Added to favorites" });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// TODO: remove an animal from favorites AAAAAA
exports.removeFavorite = async (req, res) => {
    const { animalId } = req.params;

    try {
        await db.query(
            'DELETE FROM favorite WHERE user_id = ? AND animal_id = ?',
            [req.session.userId, animalId]
        );
        return res.status(200).json({ success: true, message: "Removed from favorites" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout session destruction error:", err);
            return res.status(500).json({ success: false, message: "Could not log out." });
        }
        res.clearCookie('connect.sid'); 
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    });
};
