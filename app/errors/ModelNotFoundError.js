const ApplicationError = require('./ApplicationError');

class ModelNotFoundError extends ApplicationError {

  constructor(message = 'Data not found!', status = 400, customCode = null) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message;

    this.status = status;

    this.customCode = customCode;

  }
}

module.exports = ModelNotFoundError;
