const ContactSubmission = require('../models/contactSubmissionModel');
const Order = require('../models/orderModel');
const userModel = require("../models/userModel");
const { hashPassword } = require("../helpers/auth.helper");

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

const updateUserController = async (req, res) => {
    const userId = req.params.id;

    try {
        const { name, email, password, address, role } = req.fields;
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email, address, role }, // Update fields if provided
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update password if provided
        if (password) {
            // Hash the new password
            const hashedPassword = await hashPassword(password);
            updatedUser.password = hashedPassword;
            await updatedUser.save(); // Save the updated password
        }

        // Update photo if provided
        if (req.files && req.files.photo) {
            const { photo } = req.files;
            if (photo.size > 1000000) {
                return res.status(400).json({ success: false, error: 'Image size should be less than 1MB' });
            }
            updatedUser.photo.data = fs.readFileSync(photo.path);
            updatedUser.photo.contentType = photo.type;
            await updatedUser.save(); // Save the updated photo
        }

        res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, error, message: 'Error updating user' });
    }
};

const getUserPhotoController = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).select('photo');

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (!user.photo || !user.photo.data) {
            return res.status(404).send({ message: 'Photo not found for this user' });
        }

        res.set("Content-type", user.photo.contentType);
        return res.status(200).send(user.photo.data);
    } catch (error) {
        console.error('Error fetching photo:', error);
        return res.status(500).send({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}); // Retrieve all users from the database
        res.status(200).send(users); // Return the users as JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the user ID is passed in the request parameters

        // Retrieve the user from the database by ID
        const user = await userModel.findById(userId);

        if (!user) {
            // If user is not found, return a 404 response
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // If user is found, return the user details
        res.status(200).send({
            success: true,
            user: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in retrieving user",
            error,
        });
    }
};

//test controller
const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

const deleteUserController = async (req, res) => {
    const userId = req.params.id;

    try {
        // Check if the user exists
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Delete the user
        const deletedUser = await userModel.findOneAndDelete({ _id: userId })

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error, message: 'Error deleting user' });
    }
};

module.exports = { contactSubmission, createOrder, updateUserController, getUserPhotoController, getAllUsers, getSingleUser, testController, deleteUserController };
