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

        this.getEnrolment = models.Student.belongsTo(models.Enrolment, {
            // foreignKey: 'enrolment_id',
            constraints: false,
            as: 'enrolment',
        });

        this.getPackage = models.Student.belongsTo(models.Package, {
            // foreignKey: 'package_id',
            constraints: false,
            as: 'package',
        });

        this.getCounsellors = models.Student.belongsToMany(models.Counsellor, {
            // through: models.CounsellorStudent,
            through: {
                model: models.CounsellorStudent,
                unique: false
            },
            constraints: false,
            as: 'counsellors',
        });

        this.getCounsellorStudent = models.Student.hasMany(models.CounsellorStudent, {
            foreignKey: 'student_id',
            constraints: false,
            as: 'counsellor_students',
        });

        this.getShortlistedStudentPrograms = models.Student.hasMany(models.ShortlistedStudentProgram, {
            foreignKey: 'student_id',
            constraints: false,
            as: 'shortlisted_student_programs'
        });

        this.getRoadmap = models.Student.hasMany(models.Roadmap, {
            foreignKey: 'student_id',
            constraints: false,
            as: 'roadmap'
        })
        
    }

    // ===============================
    // Model Methods
    // ===============================


    // ===============================
    // Instance Methods
    // ===============================
    async getCounsellor() {
        let counsellors = await this.getCounsellors();
        return App.lodash.head(counsellors);
    }
}

// ===============================
// Instance Members
// ===============================

Student.fillables = [
    'status',
    // 'roadmap',
    'package_id',
];

Student.hidden = ['id'];

Student.includes = {
    enrolment: {
        as: 'enrolment',
        model: 'enrolment',
        isDefault: true,
        funcName: 'getEnrolment',
    },
    package: {
        as: 'package',
        model: 'package',
        isDefault: true,
        funcName: 'getPackage',
    },
    counsellors: {
        as: 'counsellors',
        model: 'counsellor',
        isDefault: false,
        funcName: 'getCounsellors',
    },
    roadmap: {
        as: 'roadmap',
        model: 'roadmap',
        isDefault: false,
        funcName: 'getRoadmap'
    }
};

module.exports = Student;
