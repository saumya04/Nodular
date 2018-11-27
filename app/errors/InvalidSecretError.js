const ApplicationError = require('./ApplicationError');

class InvalidSecretError extends ApplicationError {

    constructor(message = null, status = null, customCode = null) {

        super();
        
        Error.captureStackTrace(this, this.constructor);
        
        this.name = this.constructor.name;
        
        this.message = "Invalid or no secret key found in header!";
        
        this.status = 400;

        this.message = message || this.message;
        
        this.status = status || this.status;

        this.customCode = customCode;

    }
}

module.exports = InvalidSecretError;