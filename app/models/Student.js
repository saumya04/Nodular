const BaseModel = require("./BaseModel");

class Student extends BaseModel {

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
                enrolment_id: DataTypes.INTEGER(11).UNSIGNED,
                package_id: DataTypes.INTEGER(11).UNSIGNED,
                status: DataTypes.TINYINT,
                state: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    defaultValue: 0
                },
                balance: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                    defaultValue: 0.0,
                },
                package_deadline: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                // roadmap: DataTypes.JSON,
            },
            {
                modelName: 'Student',
                tableName: 'students',
                underscored: true,
                sequelize
            }
        );
    }

    // ===============================
    // Model Associations
    // ===============================

    static associate(models) {
        this.getUser = models.Student.hasOne(models.User, {
            foreignKey: 'userable_id',
            constraints: false,
            scope: {
                userable_type: 'Student'
            },
            as: 'user',
        });        
    }

    // ===============================
    // Model Methods
    // ===============================


    // ===============================
    // Instance Methods
    // ===============================
}

// ===============================
// Instance Members
// ===============================

Student.fillables = [
    'status',
];

Student.hidden = ['id'];

Student.includes = {
    
};

module.exports = Student;
