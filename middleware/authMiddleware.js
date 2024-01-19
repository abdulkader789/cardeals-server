const JWT = require('jsonwebtoken')
const userModel = require("../models/userModel");

//Protected Routes token base
const requireSignIn = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authorizationHeader.split(' ')[1];
        const decode = JWT.verify(token, process.env.JWT_SECRET);

        req.user = decode;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};


//admin acceess
const isAdmin = async (req, res, next) => {
    try {

        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (!user || user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access",
            });
        } else {
            next();
        }


    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: 'Error in admin middleware',
        });
    }
};


module.exports = { requireSignIn, isAdmin }