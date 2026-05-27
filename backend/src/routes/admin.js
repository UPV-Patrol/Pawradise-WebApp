//DESCRIPTION: define administrative endpoints and directs to specific admin controller functions

const { Router } = require('express');
const router = Router();

const adminController = require('../../controllers/adminController');
const auth = require('../middlewares/auth');

//--- DEFINE ENDPOINTS AND EXECUTE ADMIN CONTROLLER FUNCTIONS ASSOCIATED ---

router.get('/view-sponsors', auth, adminController.getAllSponsorships);
router.get('/stats', auth, adminController.getStats); 

//patcj for updating stat im sleepy gaiz
router.patch('/sponsorship/:id/status', auth, adminController.updateStatus);

module.exports = router;