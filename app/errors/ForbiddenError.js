const ApplicationError = require('./ApplicationError');

class ForbiddenError extends ApplicationError {

    constructor(message = null, status = 403, customCode = null) {

        super();
        
        Error.captureStackTrace(this, this.constructor);
        
        this.name = this.constructor.name;
        
        this.status = status || 403;

        this.customCode = customCode;

        this.message = message;

        this.assignValidMessageForError();
    }

    assignValidMessageForError() {
        if(! App.lodash.isNull(this.customCode)) {
            this.message = App.helpers.getMessageValue(`error.codes.${this.customCode}`);
            
            return;
        }
        
        this.message = this.message || "Access Denied! You don't have permission to access this request.";
    }
}

module.exports = ForbiddenError;