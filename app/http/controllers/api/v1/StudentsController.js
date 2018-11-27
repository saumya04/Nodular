const {
    UserTransformer,
} = require('../../../../transformers');
const BaseController = require('./BaseController');
const UserService = require('../../../../services/UserService');

module.exports = {

    get: async (req, res) => {
        let user = await new UserService(req)
            .getUser(req.params.studentUserId);
        let transformedData = await BaseController.getTransformedData(req, user, UserTransformer);
        return res.success(transformedData);
    },

}