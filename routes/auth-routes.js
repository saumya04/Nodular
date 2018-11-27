const AuthController = require("../app/http/controllers/api/v1/AuthController");

module.exports = {

	[`POST login`]: {
		action: AuthController.login,
		name: 'api.login',
		middlewares: [],
	},

	[`POST logout`]: {
		action: AuthController.logout,
		name: 'api.logout',
		middlewares: [],
	},

	[`POST forgot-password`]: {
		action: AuthController.forgotPassword,
		name: 'api.forgotPassword',
		middlewares: [],
	},

	[`POST reset-password`]: {
		action: AuthController.resetPassword,
		name: 'api.resetPassword',
		middlewares: [],
	}
}
