const ForbiddenError = require('../../../errors/ForbiddenError');
const UnauthorizedError = require('../../../errors/UnauthorizedError');
const Models = require('../../../models');

module.exports = {

    checkForAuthenticTokenRoute: async (req, res, next) => {

        let authUser = getAuthUser(req);
        let student = null;
        const { studentId, studentUserId } = req.params;
        let isValid = false;

        if (App.lodash.isUndefined(studentUserId)) {
            student = await authUser.userable;
        }

        isValid = (authUser.getData('uuid') == studentUserId) || (authUser.getData('slug') == studentUserId);

        App.helpers.addMetaDataToReq(req, {
            studentUser: authUser,
        });

        if(student) {
            isValid = student.getData('uuid') == studentId;
            App.helpers.addMetaDataToReq(req, {
                student: student,
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
