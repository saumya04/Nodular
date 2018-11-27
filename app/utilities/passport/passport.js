const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../../models/User');
const UnauthorizedError = require('../../errors/UnauthorizedError');

let jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: App.env.JWT_SECRET,
}

var strategy = new JWTStrategy(jwtOptions, function (jwtPayload, next) {
    console.log('payload received [JWT]', jwtPayload);
    // usually this would be a database call:
    User.findById(jwtPayload.id)
        .then((user) => {
            if (user) {
                return next(null, user);
            } else {
                return next(null, false);
            } 
        }).catch((err) => {
            return next(err);
        });
});

passport.use(strategy);
