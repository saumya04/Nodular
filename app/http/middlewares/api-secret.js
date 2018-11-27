const InvalidSecretError = require('../../errors/InvalidSecretError');

module.exports = function(req, res, next) {
    const secretKey = req.header(App.env.API_SECRET_KEY_NAME);
    
    if(secretKey !== App.env.API_SECRET) {
        throw new InvalidSecretError();
    }
    
    next();
}