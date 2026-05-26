//DESCRIPTION: define endpoint and directs to specific user controller functions

const {Router} = require('express');
const router = Router();

const db = require('../config/db'); // db connect
const userController = require('../../controllers/userController');
const auth = require('../middlewares/auth');

//--- DEFINE ENDPOINTS AND EXECUTE USER CONTROLLER FUNCTIONS ASSOCIATED  ---
//middleware: for validation of email and pw
const { validateSignup } = require('../middlewares/validateSignUp');

router.post('/signup', validateSignup, userController.signup)
router.post('/login', userController.login); 

router.get('/auth-status', auth, (req, res) => {
    res.json({ isLoggedIn: true, user: req.user });
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out' });
    });
});

module.exports = router