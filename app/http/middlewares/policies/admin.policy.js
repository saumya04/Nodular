const ForbiddenError = require('../../../errors/ForbiddenError');
const UnauthorizedError = require('../../../errors/UnauthorizedError');
const Models = require('../../../models');

module.exports = {

    checkForAuthenticTokenRoute: async (req, res, next) => {

        let authUser = getAuthUser(req);
        let admin = null;
        const { adminId, adminUserId } = req.params;
        let isValid = false;

        if (App.lodash.isUndefined(adminUserId)) {
            admin = await authUser.userable;
        }

        isValid = (authUser.getData('uuid') == adminUserId) || (authUser.getData('slug') == adminUserId);

        App.helpers.addMetaDataToReq(req, {
            adminUser: authUser,
        });

        if(admin) {
            isValid = admin.getData('uuid') == adminId;
            App.helpers.addMetaDataToReq(req, {
                admin: admin,
            });
        }

        if(! isValid) {
            throw new ForbiddenError();
        }

        next();
    },

};

function getAuthUser(req) {
    let authUser = App.helpers.getAuthUser(req);
        
    if(! authUser) {
        throw new UnauthorizedError();
    }

    return authUser;
}
