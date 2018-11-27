const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressStatusMonitor = require('express-status-monitor');
const ErrorHandler = require('../../errors/ErrorHandler');

module.exports = function (app) {
    app.use(expressStatusMonitor());
    app.use(compression());
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(ErrorHandler);

    // CORS Fix
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS, PATCH");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });

}
