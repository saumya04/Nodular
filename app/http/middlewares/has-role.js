const ForbiddenError = require('../../errors/ForbiddenError');
const UnauthorizedError = require('../../errors/UnauthorizedError');

module.exports = (role) => {

    return (req, res, next) => {
        let authUser = App.helpers.getObjProp(req, 'auth.user');

        if(! req.auth.isLoggedIn) {
            throw new UnauthorizedError();
        }
        
        let userType = authUser.getType();
        let rolesArr = role.split(',');
        
        for(let i = 0; i < rolesArr.length; i++) {
            App.lodash.includes(role.split(','), 1);
        }

        if(! App.lodash.includes(rolesArr, userType)) {
            throw new ForbiddenError();
        }

        next();
    };

};