//DESCRIPTION: define endpoint and directs to specific sponsor controller functions
//NOTE: need to pass authentication  first 

const { Router } = require('express');
const router = Router();
const sponsorController = require('../../controllers/sponsorController');

//for requiring logged in account to access this 
const auth = require('../middlewares/auth');

//custom multer config for 
const upload = require('../middlewares/multer');

// DEFINE ENDPOINTS AND EXECUTE ASSOCIATED CONTROLLER FUNCTIONS
router.post('/createSponsorship', auth, upload.single('proof_img'), sponsorController.createSponsorship);



module.exports = router;