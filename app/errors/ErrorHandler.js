const chalk = require('chalk');
const ImportError = require('./ImportError');
const GenericError = require('./GenericError');
const ForbiddenError = require('./ForbiddenError');
const ValidationError = require('./ValidationError');
const UnauthorizedError = require('./UnauthorizedError');
const ModelNotFoundError = require('./ModelNotFoundError');
const InvalidSecretError = require('./InvalidSecretError');

module.exports = function (err, req, res, next) {
    
    console.log(chalk.red('======================================================'));
    console.log(chalk.bgRed(chalk.white(err)))
    console.log(err);
    console.log(chalk.red('======================================================'));

    switch (err.constructor) {
        case InvalidSecretError:
            return res.error(err, err.status);
        
        case UnauthorizedError:
            return res.error(err, 401, err.customCode);

        case ValidationError:
            return res.error(err, 422, err.customCode);

        case GenericError:
            return res.error(err, err.status, err.customCode);

        case ModelNotFoundError:
            return res.error(err, 400, err.customCode);

        case ImportError:
            return res.error(err, 400, err.customCode);

        case ForbiddenError:
            return res.error(err, 403, err.customCode);

        default:
            if(! App.env.APP_DEBUG) {
                return res.error(new Error("Something went wrong, Please try again later!"), 500);
            }
            return res.error(err, 500);
    }

}
