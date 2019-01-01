const jwt = require('jsonwebtoken');
const config = require('config');
const async = require('async');


module.exports = function (req, res, next) {
    console.log(req.body)
    const token= req.header('x-auth-token');
    if(token){
        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            if(decoded){
                return res.status(200).send(decoded);
            }
            // req.body = decoded; 
            // next();
          }
          catch (ex) {
            return res.status(400).send('Invalid token.');
          }
    }
    next();
}

