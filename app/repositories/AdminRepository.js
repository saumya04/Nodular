const Admin = require('../models').Admin;
const BaseRepository = require('./BaseRepository');

class AdminRepository extends BaseRepository {

    constructor(req) {
        super();
        this.req = req;
        this.model = Admin;
    }

}

module.exports = AdminRepository;