const BaseTransformer = require('./BaseTransformer');
const { Admin } = require('../models');

class AdminTransformer extends BaseTransformer {

    constructor(req, data, transformOptions = null) {
        super(req, data, transformOptions);
        this.model = Admin;
    }

    async transform(admin) {
        admin = await admin;
        return App.helpers.cloneObj({
            id: admin.uuid,
        });
    }

}

module.exports = AdminTransformer;