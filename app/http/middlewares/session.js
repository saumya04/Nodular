const session = require('express-session');
const lusca = require('lusca');

module.exports = function (app) {
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    }));

    app.use((req, res, next) => {
        if (req.path === '/api/upload') {
            next();
        } else {
            lusca.csrf()(req, res, next);
        }
    });
    app.use(lusca.xframe('SAMEORIGIN'));
    app.use(lusca.xssProtection(true));
    app.disable('x-powered-by');
    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
}