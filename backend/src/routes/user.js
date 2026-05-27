//DESCRIPTION: define endpoint and directs to specific user controller functions

const {Router} = require('express');
const router = Router();

const db = require('../config/db');
const userController = require('../../controllers/userController');
const auth = require('../middlewares/auth');

//--- DEFINE ENDPOINTS AND EXECUTE USER CONTROLLER FUNCTIONS ASSOCIATED ---
const { validateSignup } = require('../middlewares/validateSignUp');

router.post('/signup', validateSignup, userController.signup);
router.post('/login', userController.login); 

router.get('/auth-status', auth, (req, res) => {
    res.json({ isLoggedIn: true, user: req.user });
});

router.post('/logout', userController.logout);

// dashboard route
router.get('/my-sponsorships', auth, userController.getMySponsorship);

// fav routes
router.get('/favorites', auth, userController.getFavorites);
router.post('/favorites', auth, userController.addFavorite);
router.delete('/favorites/:animalId', auth, userController.removeFavorite);

module.exports = router;