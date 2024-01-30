const express = require('express');
const router = express.Router();
const { registerController, loginController, getAllUsers, deleteUserController, testController, getSingleUser, updateUserController, getUserPhotoController } = require('../controllers/auth.controller');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware')
const formidable = require('express-formidable');


router.route('/register').post(registerController)
router.route('/login').post(loginController)


router.route("/test").get(requireSignIn, isAdmin, testController);

router.route('/get-all-users').get(getAllUsers)
router.route('/get-single-user/:id').get(getSingleUser)
router.route('/update-user/:id').put(requireSignIn, formidable(), updateUserController)
router.route('/get-user-photo/:id').get(getUserPhotoController);
router.route('/delete-user/:id').delete(requireSignIn, deleteUserController)
module.exports = router