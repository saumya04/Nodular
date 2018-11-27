const Role = require('../models').Role;
const BaseRepository = require('./BaseRepository');

class RoleRepository extends BaseRepository {

    constructor(req) {
        super();
        this.req = req;
        this.model = Role;
    }

}

module.exports = RoleRepository;