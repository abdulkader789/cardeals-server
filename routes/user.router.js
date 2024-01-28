const express = require('express');
const router = express.Router();
;
const { requireSignIn } = require('../middleware/authMiddleware');
const { contactSubmission, createOrder, getAllUsers } = require('../controllers/user.controller')

router.route("/form-submit").post(requireSignIn, contactSubmission);
router.route("/order").post(requireSignIn, createOrder);

router.route('/get-all-users').get(getAllUsers)




module.exports = router