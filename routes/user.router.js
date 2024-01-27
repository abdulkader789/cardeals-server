const express = require('express');
const router = express.Router();
;
const { requireSignIn } = require('../middleware/authMiddleware');
const { contactSubmission } = require('../controllers/user.controller')

router.route("/form-submit").post(requireSignIn, contactSubmission);






module.exports = router