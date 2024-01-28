const ContactSubmission = require('../models/contactSubmissionModel');
const Order = require('../models/orderModel');


// Route to handle contact form submissions
const contactSubmission = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        // Validate input data here if needed

        const newSubmission = new ContactSubmission({
            userId: req.user._id,
            name,
            email,
            phone,
            message
        });

        const savedSubmission = await newSubmission.save();
        res.status(201).send({ message: 'Contact form submitted successfully', submission: savedSubmission });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).send({ error: 'An error occurred while processing your request' });
    }
};

// Route to create a new order
const createOrder = async (req, res) => {
    try {
        const { productId, name, email, phone, message, appointmentDateTime } = req.body;
        // Validate input data here if needed

        const order = new Order({
            productId,
            userId: req.user._id,
            name,
            email,
            phone,
            message,
            appointmentDateTime
        });

        await order.save();
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = { contactSubmission, createOrder };
