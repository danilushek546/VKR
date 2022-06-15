const jwt = require('jsonwebtoken');

function getUserFromToken(headersAuth) {
    const token = headersAuth.split(' ')[1];
    return jwt.verify(token, process.env.secretKey);
}

module.exports = getUserFromToken;