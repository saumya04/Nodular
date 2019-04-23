const HomeController = require("../app/http/controllers/api/v1/HomeController");

// Routes
const studentRoutes = require("./student-routes");
const adminRoutes = require('./admin-routes');
const authRoutes = require("./auth-routes");

module.exports = {

    // ########################################
    // Common Routes
    // ########################################

    [`GET config`]: {
        action: HomeController.config,
        name: "api.config",
        middlewares: [
            // 'apiSecret',
            // 'auth.jwt',
            // passport.authenticate('jwt', {session: false})
        ]
    },


    ...authRoutes,
    ...adminRoutes,
    ...studentRoutes,

};
