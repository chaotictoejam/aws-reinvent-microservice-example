'use strict';

const nJwt = require('njwt');

const signingKey = process.env.JWT_SIGNING_KEY;

// Get the user identifier from the supplied context
module.exports.getUserId = function (event) {
    const bearerToken = event.headers['Authorization'];
    let userId = "";
    try {
        const jwtToken = bearerToken.substring(bearerToken.indexOf(' ') + 1);
        const verifiedJwt = nJwt.verify(jwtToken, signingKey);
        userId = verifiedJwt.body.userId;
    } catch (e) {
        console.log("Error verifying token: " + e);
    }

    return userId;
}