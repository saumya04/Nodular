const ApplicationError = require('./ApplicationError');

class GenericError extends ApplicationError {

    constructor(message, status = null, customCode = null) {

        super();
        
        Error.captureStackTrace(this, this.constructor);
        
        this.name = this.constructor.name;
        
        this.message = message;
        
        this.status = 400;

        this.status = status || this.status;

        this.customCode = customCode;

        this.assignValidMessageForError();
    }

    assignValidMessageForError() {
        if(! App.lodash.isNull(this.customCode)) {
            this.message = App.helpers.getMessageValue(`error.codes.${this.customCode}`);
            
            return;
        }
        
        this.message = this.message || App.helpers.getMessageValue('defaults.error');
    }
}

module.exports = GenericError;