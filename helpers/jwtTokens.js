const JWT = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return JWT.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
};

const generateRefreshToken = (userId) => {
    return JWT.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '12h' });
};

module.exports = { generateAccessToken, generateRefreshToken }