const passport = require('passport');

module.exports = {

    jwt: passport.authenticate('jwt', { session: false }),

}