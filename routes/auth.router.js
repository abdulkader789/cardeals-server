const express = require('express');
const router = express.Router();
const { registerController, loginController, getAllUsers, testController } = require('../controllers/auth.controller');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware')

router.route('/register').post(registerController)
router.route('/login').post(loginController)


router.route("/test").get(requireSignIn, isAdmin, testController);

router.route('/get-all-users').get(getAllUsers)




module.exports = router