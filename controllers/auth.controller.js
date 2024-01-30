const dotenv = require('dotenv');
dotenv.config();
const JWT = require('jsonwebtoken')
const userModel = require('../models/userModel');
const formidable = require('formidable');
const fs = require('fs');
const asyncWrapper = require('../middleware/asyncWrapper')


const { comparePassword, hashPassword } = require("../helpers/auth.helper");

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
        const userId = req.params.id; // Extract the photo ID from request parameters

        // Find the photo by ID in MongoDB and select specific fields
        const user = await userModel.findById(userId).select('photo'); // Example: Selecting title and imageUrl fields
        if (user.photo.data) {
            res.set("Content-type", user.photo.contentType)
            return res.status(200).send(user.photo.data);
        } else {
            return res.status(404).send({ message: 'Photo not found' });
        }

    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).send({ message: 'Server error' });
    }
};



const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find(); // Retrieve all users from the database
        res.status(200).send(users); // Return the users as JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
const registerController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validations

        if (!email) {
            return res.send({ error: "Email is Required" });
        }
        if (!password) {
            return res.send({ error: "Password is Required" });
        }
        // if (!name) {
        //     return res.send({ error: "Name is Required" });
        // }
        // if (!phone) {
        //     return res.send({ error: "Phone no is Required" });
        // }
        // if (!address) {
        //     return res.send({ error: "Address is Required" });
        // }
        //check user
        const existingUser = await userModel.findOne({ email });
        //exisiting user
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: "Already Register please login",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({

            email,

            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Errro in Registeration",
            error,
        });
    }
};

//POST LOGIN
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                adddress: user.address,
                role: user.role
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

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

module.exports = { registerController, loginController, testController, updateUserController, getAllUsers, getSingleUser, getUserPhotoController, deleteUserController }