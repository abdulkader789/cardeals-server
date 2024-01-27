const ContactSubmission = require('../models/contactSubmissionModel')
const Order = require('../models/orderModel')
const contactSubmission = async (req, res) => {
    try {
        // Extract data from request body
        const { name, email, phone, message } = req.body;

        // Create new contact submission instance
        const newSubmission = new ContactSubmission({
            userId: req.user._id, // Assuming you have user authentication and `req.user` contains the authenticated user's information
            name,
            email,
            phone,
            message
        });

        // Save the submission to the database
        const savedSubmission = await newSubmission.save();

        // Respond with success message
        res.status(201).send({ message: 'Contact form submitted successfully', submission: savedSubmission });
    } catch (error) {
        // Handle errors
        console.error('Error submitting contact form:', error);
        res.status(500).send({ error: 'An error occurred while processing your request' });
    }
};


const createOrder = async (req, res) => {
    try {
        const { productId, userId, name, email, phone, message, appointmentDateTime } = req.body;

        // Create a new order instance
        const order = new Order({
            productId,
            userId: req.user._id,
            name,
            email,
            phone,
            message,
            appointmentDateTime
        });

        // Save the order to the database
        await order.save();

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

module.exports = { contactSubmission, createOrder }