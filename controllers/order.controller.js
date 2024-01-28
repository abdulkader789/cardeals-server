const Product = require('../models/productModel')
const Order = require('../models/orderModel');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).send(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
const getConfirmedOrders = async (req, res) => {
    try {
        const { ids } = req.body; // Extract the array of product IDs from the request body
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ error: 'Invalid IDs array' });
        }

        // Query the Product model to find products with IDs in the provided array
        const products = await Product.find({ _id: { $in: ids } });

        // Extract the prices of products
        const prices = products.map(product => product.price);

        // Calculate the total price of the confirmed orders
        const totalPrice = prices.reduce((acc, curr) => acc + curr, 0);

        // Return the total price along with the confirmed orders
        res.status(200).json({ success: true, totalPrice, products });
    } catch (error) {
        // Handle any errors
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
    }
};
module.exports = { getAllOrders, getConfirmedOrders }