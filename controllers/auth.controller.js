const dotenv = require('dotenv');
dotenv.config();
const JWT = require('jsonwebtoken')
const userModel = require('../models/userModel');

const asyncWrapper = require('../middleware/asyncWrapper')


const { comparePassword, hashPassword } = require("../helpers/auth.helper");
const { generateAccessToken, generateRefreshToken } = require("../helpers/JWTTokens")

const registerController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validations

        if (!email) {
            return res.json({ error: "Email is Required" });
        }
        if (!password) {
            return res.json({ error: "Password is Required" });
        }

        const existingUser = await userModel.findOne({ email });
        //exisiting user
        if (existingUser) {
            return res.status(200).json({
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

        res.status(201).json({
            success: true,
            message: "User Register Successfully",

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
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

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email is not registered" });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Generate access token
        const accessToken = generateAccessToken(user._id);

        // Generate refresh token
        const refreshToken = generateRefreshToken(user._id);

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' });

        // Set access token in response header
        res.header('Authorization', `Bearer ${accessToken}`);

        // json user details and tokens in response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email
            },
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in login", error });
    }
};


const refreshController = async (req, res) => {
    let refreshToken;

    // Check if refresh token is in cookies
    if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
    }

    // Check if refresh token is in headers
    if (!refreshToken && req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        refreshToken = authHeader.split(' ')[1]; // Extract token from Authorization header
    }

    if (!refreshToken) {
        return res.status(401).json('Access Denied. No refresh token provided.');
    }

    try {
        const decoded = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = generateAccessToken(decoded.user);

        res
            .header('Authorization', `Bearer ${accessToken}`)
            .json(decoded.user);
    } catch (error) {
        console.error(error);
        return res.status(400).json('Invalid refresh token');
    }
};

module.exports = { registerController, loginController, refreshController }