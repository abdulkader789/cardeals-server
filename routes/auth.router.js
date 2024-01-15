const express = require('express');
const router = express.Router();
const { registerController, loginController, testController } = require('../controllers/auth.controller');

router.route('/register').post(registerController)
router.route('/login').post(loginController)






module.exports = router