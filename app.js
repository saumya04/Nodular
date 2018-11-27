/**
 * Module dependencies.
 */
const express = require('express');
const chalk = require('chalk');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('passport');
const middlewares = require('./app/http/middlewares');
const models = require("./app/models");
const globals = require('./config/globals');
const Routes = require('./routes');
const ErrorHandler = require('./app/errors/ErrorHandler');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Create Express server.
 */
const app = express();

/**
 * Sync Database & their Models
 */
models.sequelize.sync().then(function() {
    console.log(chalk.green('Nice! Database looks fine'));
}).catch(function(err) {
    console.log(chalk.red(err, "Something went wrong with the Database Update!"));
});

// Exporting globals to node environment
global['App'] = globals;

// Passport Initialisation
require('./app/utilities/passport/passport');
app.use(passport.initialize());

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

/**
 * Common Middlewares.
 */
middlewares.general(app);
middlewares.requestInterceptor(app);
middlewares.responses(app);

// For adding user info in the global req object per session
middlewares.auth.userLogin(app);

// For listening to firease db events
if(process.env.TRIGGER_PUSH_NOTIFICATION) {
    middlewares.firebaseService.listenToDbChanges();
}

/**
 * Loading providers.
 */
require('./app/providers');

/**
 * Primary app routes.
 */
console.log(chalk.black.bgBlue("Initialising routes..."));
for(let routerKey in Routes) {
    console.log(chalk.blue.bold(`Loading routes for prefix: ${Routes[routerKey]['prefix']}`));
    app.use(Routes[routerKey]['prefix'], Routes[routerKey]['routes']());
}

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
    // only use in development
    // app.use(errorHandler());
}

// Exposing directories from server
app.use("/public", express.static(path.join(__dirname, 'public')));

// Handling Errors (Global Handler)
app.use(ErrorHandler);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;