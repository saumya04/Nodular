const UserValidator = require('../validators/UserValidator');
const UserRepository = require('../repositories/UserRepository');

class UserService {

    /**
     * Initializing common properties
     */
    constructor(req) {
        this.req = req;
        this.userValidator = new UserValidator();
        this.userRepo = new UserRepository(req);
    }

    
    /**
     * Get User from DB with the specified criteria
     * @param {Object} params
     */
    async getUser(id, criteria = {}) {
        let user = App.helpers.getReqMetaData(this.req, 'studentUser');
        user =  user || await this.userRepo.getBy(App.helpers.cloneObj({ uuid: id }, criteria), true, true);
        return user;
    }

}

module.exports = UserService;
