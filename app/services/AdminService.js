const UserRepository = require("../repositories/UserRepository");
const AdminRepository = require("../repositories/AdminRepository");

class AdminService {
    /**
     * Initializing common properties
     */
    constructor(req) {
        this.req = req;

        this.userRepo = new UserRepository(req);
        this.adminRepo = new AdminRepository(req);
    }

}


module.exports = AdminService;
