const express = require('express');
const router = express.Router();

const { getAllOrders } = require('../controllers/order.controller');



router.route('/get-all-orders').get(getAllOrders)




module.exports = router