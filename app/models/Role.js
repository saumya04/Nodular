const BaseModel = require("./BaseModel");

class Role extends BaseModel {

    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER(11).UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true
                },
                name: DataTypes.STRING,
                display_name: DataTypes.STRING,
                description: DataTypes.TEXT,
            },
            {
                modelName: 'Role',
                tableName: 'roles',
                underscored: true,
                sequelize
            }
        );
    }

    // ===============================
    // Model Associations
    // ===============================

    static associate(models) {
        models.Role.hasMany(models.User, {
            foreignKey: 'role_id',
			constraints: false,
			as: 'users',
        });
    }

    // ===============================
    // Model Methods
    // ===============================


    // ===============================
    // Instance Methods
    // ===============================

}

module.exports = Role;