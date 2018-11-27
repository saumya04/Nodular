const HomeController = require('../app/http/controllers/HomeController');
const FilesController = require('../app/http/controllers/FilesController');

module.exports = {
    
    [`GET /`]: {
        action: HomeController.index,
        name: 'api.config',
        middlewares: [],
    },

    [`GET test`]: {
        action: HomeController.test,
        name: 'web.test',
        middlewares: [],
    },

    [`GET users/:userSlug/photo`]: {
        action: FilesController.showUserPhoto,
        name: 'users.photo.show',
        middlewares: [],
    },

    [`GET reset-password/:token`]: {
        action: HomeController.showConversationFile,
        name: 'auth.resetPassword',
        middlewares: [],
    },

}
