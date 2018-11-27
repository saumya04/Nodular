const BaseModel = require("./BaseModel");

class Admin extends BaseModel {

    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER(11).UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true
                },
                uuid: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                },
            },
            {
                modelName: 'Admin',
                tableName: 'admins',
                underscored: true,
                sequelize
            }
        );
    }

    // ===============================
    // Model Associations
    // ===============================

    static associate(models) {
        models.Admin.hasOne(models.User, {
            foreignKey: 'userable_id',
            constraints: false,
            scope: {
                userable: 'Admin'
            },
            as: 'userable',
        });
    }

    // ===============================
    // Model Methods
    // ===============================


    // ===============================
    // Instance Methods
    // ===============================

}

module.exports = Admin;