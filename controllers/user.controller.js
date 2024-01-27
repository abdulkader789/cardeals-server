const ContactSubmission = require('../models/contactSubmissionModel')

const contactSubmission = async (req, res) => {
    try {
        // Extract data from request body
        const { name, email, phone, message } = req.body;

        // Create new contact submission instance
        const newSubmission = new ContactSubmission({
            user: req.user._id, // Assuming you have user authentication and `req.user` contains the authenticated user's information
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

module.exports = { contactSubmission }