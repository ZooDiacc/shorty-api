const jwt = require('jsonwebtoken');
const fs = require('fs');

const PUB_KEY = fs.readFileSync(__dirname + '/pub_key.pem', 'itf8');
const PRIV_KEY = fs.readFileSync(__dirname + '/priv_key.pem', 'itf8');

const payloadObj = {
    sub: '1234567890',
    name: 'john Doe',
    admin: true,
    iat: '1516239022',
}


const signedJWT = jwt.sign(payloadObj, PRIV_KEY, { algorithm: 'RS256' });

console.log(signedJWT);

jwt.verify(signedJWT, PUB_KEY, { algorithm: ["RS256"] }, (err, payload) => {});