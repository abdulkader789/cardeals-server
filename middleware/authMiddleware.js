const JWT = require('jsonwebtoken');
const userModel = require("../models/userModel");

const authenticate = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken && !refreshToken) {
        return res.status(401).json({ error: 'Access Denied. No token provided.' });
    }

    try {
        if (accessToken) {
            const decodedAccessToken = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedAccessToken.user;
            return next();
        } else {
            const decodedRefreshToken = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = JWT.sign({ user: decodedRefreshToken.user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' });
            res.header('Authorization', `Bearer ${newAccessToken}`);
            req.user = decodedRefreshToken.user;
            return next();
        }
    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token.' });
    }
};


// Admin access middleware
const isAdmin = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (!user || user.role !== 1) {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized Access",
            });
        } else {
            return next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            error,
            message: 'Error in admin middleware',
        });
    }
};

module.exports = { isAdmin, authenticate };
