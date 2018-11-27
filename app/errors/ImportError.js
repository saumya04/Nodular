const ApplicationError = require('./ApplicationError');

class ImportError extends ApplicationError {

    constructor(message, status = null, customCode = null) {

        super();
        
        Error.captureStackTrace(this, this.constructor);
        
        this.name = this.constructor.name;
        
        this.message = message;
        
        this.status = 400;

        this.message = message || this.message;
        
        this.status = status || this.status;

        this.customCode = customCode;

    }
}

module.exports = ImportError;