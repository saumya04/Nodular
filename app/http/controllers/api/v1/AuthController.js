const { UserTransformer } = require('../../../../transformers');
const AuthService = require('../../../../services/AuthService');
const BaseController = require('./BaseController');
const jwt = require('jsonwebtoken');

module.exports = {

    login: async (req, res) => {
        let user = await new AuthService(req).login(req.allParams)
        let transformedData = await BaseController.getTransformedData(req, user, UserTransformer);
        let token = jwt.sign({ id: user.getData('id') }, App.env.JWT_SECRET, {
            expiresIn: App.env.JWT_TOKEN_EXPIRY,
        });
        transformedData = App.helpers.cloneObj(transformedData, { token });
        return res.success(transformedData);
    },

    forgotPassword: async (req, res) => {
        await new AuthService(req).forgotPassword(req.allParams);
        return res.noContent();
    },

    resetPassword: async (req, res) => {
        await new AuthService(req).resetPassword(req.allParams);
        return res.noContent();
    },

    logout: async (req, res) => {
        const jwtToken = App.helpers.getToken(req, res);
        await new AuthService(req).logout(jwtToken, req.allParams);
        return res.noContent();
    },

}