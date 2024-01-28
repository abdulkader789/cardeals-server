const express = require('express');
const router = express.Router();

const { getAllOrders, getConfirmedOrders } = require('../controllers/order.controller');



router.route('/get-all-orders').get(getAllOrders)

router.route('/get-all-confirmed-orders').post(getConfirmedOrders)


module.exports = router