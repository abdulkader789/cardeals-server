const express = require('express');
const router = express.Router();
const formidable = require('express-formidable');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const { getAllUsers, getSingleUser, updateUserController, getUserPhotoController, deleteUserController } = require('../controllers/user.controller')

// router.route("/form-submit").post(requireSignIn, contactSubmission);
// router.route("/order").post(requireSignIn, createOrder);


router.route('/get-all-users').get(getAllUsers)
router.route('/get-single-user/:id').get(getSingleUser)
router.route('/update-user/:id').put(authenticate, isAdmin, formidable(), updateUserController)
router.route('/get-user-photo/:id').get(authenticate, isAdmin, getUserPhotoController);
router.route('/delete-user/:id').delete(authenticate, isAdmin, deleteUserController)



module.exports = router