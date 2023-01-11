require('dotenv').config();

const jsonWebToken = require('jsonwebtoken');

const expiry_time = process.env.TOKEN_TIMEOUT;
const auth_key = process.env.JWT_KEY;

const newToken = (information) => jsonWebToken.sign(information, auth_key, {expiresIn: `${expiry_time}  seconds`});

const checkToken = (token) => {
    return jsonWebToken.verify(token, auth_key, (error, information) => {
        if(information) return information;
        return null;
    });
};

module.exports = {newToken, checkToken};