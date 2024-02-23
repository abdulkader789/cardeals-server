const express = require('express');
const router = express.Router();
const { registerController, loginController, refreshController } = require('../controllers/auth.controller');



router.route('/register').post(registerController)
router.route('/login').post(loginController)
router.route('/refresh').post(refreshController)

// router.route("/test").get(requireSignIn, isAdmin, testController);


module.exports = router

