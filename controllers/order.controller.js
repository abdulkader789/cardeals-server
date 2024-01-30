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

const createOrder = async (req, res) => {
    try {
        const { product, userId, name, email, phone, message, appointmentDateTime } = req.body;

        // Create a new order instance
        const newOrder = new Order({
            product, // Include entire product details in the order
            userId,
            name,
            email,
            phone,
            message,
            appointmentDateTime,
            status: 'Pending' // Set initial status to 'Pending'
        });

        // Save the new order to the database
        await newOrder.save();

        // Return the newly created order as response
        res.status(201).send({
            success: true,
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Error in creating order:', error);
        res.status(500).send({
            success: false,
            message: 'Error in creating order',
            error: error
        });
    }
};

const updateOrderStatusToConfirmed = async (req, res) => {
    try {
        const orderId = req.params.id; // Get the order ID from request parameters

        // Retrieve the order from the database by ID
        const order = await Order.findById({ _id: orderId });

        if (!order) {
            // If order is not found, return a 404 response
            return res.status(404).send({
                success: false,
                message: "Order not found",
            });
        }

        // Update the status of the order to "Confirmed"
        order.status = 'Confirmed';
        await order.save();

        // If order is updated successfully, return success response
        res.status(200).send({
            success: true,
            message: "Order status updated to Confirmed",
            order: order,
        });
    } catch (error) {
        console.error("Error in updating order status:", error);
        res.status(500).send({
            success: false,
            message: "Error in updating order status",
            error: error,
        });
    }
};


const getConfirmedOrders = async (req, res) => {
    try {
        const { ids } = req.body; // Extract the array of product IDs from the request body
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).send({ error: 'Invalid IDs array' });
        }

        // Query the Product model to find products with IDs in the provided array
        const products = await Product.find({ _id: { $in: ids } });

        // Extract the prices of products
        const prices = products.map(product => product.price);

        // Calculate the total price of the confirmed orders
        const totalPrice = prices.reduce((acc, curr) => acc + curr, 0);

        // Return the total price along with the confirmed orders
        res.status(200).send({ success: true, totalPrice, products });
    } catch (error) {
        // Handle any errors
        console.error('Error:', error.message);
        res.status(500).send({ error: 'Failed to fetch orders', details: error.message });
    }
};

const getSingleOrder = async (req, res) => {
    try {
        const orderId = req.params.id; // Get the order ID from request parameters

        // Retrieve the order from the database by ID
        const order = await Order.findById(orderId);

        if (!order) {
            // If order is not found, return a 404 response
            return res.status(404).send({
                success: false,
                message: "Order not found",
            });
        }

        // If order is found, return the order details
        res.status(200).send({
            success: true,
            order: order,
        });
    } catch (error) {
        console.error("Error in fetching order:", error);
        res.status(500).send({
            success: false,
            message: "Error in fetching order",
            error: error,
        });
    }
};


module.exports = { getAllOrders, getConfirmedOrders, getSingleOrder, updateOrderStatusToConfirmed, createOrder }