const Sequelize = require('sequelize');

class BaseModel extends Sequelize.Model {
    
    // ===============================
    // Model Methods
    // ===============================
    static paginate(conditions = {}, perPage = null, page = null, columns = ['*'], distinct = true, pageName = 'page') {
        page = page || 1;
        let limit = App.helpers.getComputedPaginationLimit(perPage);
        let offset = (page * limit) - limit;

        return this.findAndCountAll(App.helpers.cloneObj(conditions, {
            distinct: distinct,
            offset: offset,
            limit: limit
        }));
    }

    static getId(where) {
        return this.findOne({
            where,
            attributes: ["id"],
            order: [["created_at", "DESC"]]
        });
    }

    static getIncludes(type = null) {
        if(App.lodash.isNull(type)) {
            
            return this.includes;

        } else if (App.lodash.isObject(type)) {
            
            return App.lodash.pickBy(this.includes, (val) => {
                return val[App.lodash.keys(type)[0]] == App.lodash.values(type)[0];
            });

        } else if (App.lodash.isString(type)) {
            
            switch(type) {
                case 'all':
                    return this.includes;
    
                case 'only-defaults':
                    return App.lodash.pickBy(this.includes, (val) => {
                        return val.isDefault;
                    });
                    
                case 'no-defaults':
                    return App.lodash.pickBy(this.includes, (val) => {
                        return ! val.isDefault;
                    });
            }
        }

        return null;
    }

    // ===============================
    // Instance Methods
    // ===============================
    getData(dotNotationStr = null) {
        let key = `dataValues`;
        
        if(! App.lodash.isNull(dotNotationStr)) {
            key = `${key}.${dotNotationStr}`;
        }
        
        return App.helpers.getObjProp(this, key);
    }

}

// ===============================
// Instance Members
// ===============================
BaseModel.fillables = [];
BaseModel.hidden = [ 'id' ];
BaseModel.includes = {};

module.exports = BaseModel;