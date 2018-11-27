const Models = require("../models");
const { User } = Models;
const BaseRepository = require("./BaseRepository");
const sequelize = Models.sequelize;
const Op = sequelize.Op;

class UserRepository extends BaseRepository {
    constructor(req) {
        super();
        this.req = req;
        this.model = User;
    }

    async getUniqueUser(uniqueId, throwError = false) {
        return this.getBy({
            [Op.or]: [
                { uuid: uniqueId },
                { slug: uniqueId },
            ]
        }, throwError);
    }

}

module.exports = UserRepository;
