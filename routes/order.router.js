const express = require('express');
const router = express.Router();

const { getAllOrders, getConfirmedOrders, getSingleOrder, createOrder, updateOrderStatusToConfirmed } = require('../controllers/order.controller');
const { requireSignIn } = require('../middleware/authMiddleware');



router.route('/get-all-orders').get(getAllOrders)
router.route('/get-single-order/:id').get(getSingleOrder)
router.route('/get-all-confirmed-orders').post(getConfirmedOrders)
// Route for creating a new order
router.post('/create-order', requireSignIn, createOrder);

// Route for updating order status to Confirmed
router.put('/update-order-status/:id', requireSignIn, updateOrderStatusToConfirmed);


module.exports = router