const BaseModel = require("./BaseModel");
const moment = require('moment');

class User extends BaseModel {

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
                first_name: DataTypes.STRING,
                last_name: DataTypes.STRING,
                gender: DataTypes.TINYINT,
                email: DataTypes.STRING,
                password: DataTypes.STRING,
                userable_id: DataTypes.INTEGER(11).UNSIGNED,
                userable_type: DataTypes.STRING,
                mobile_number: DataTypes.STRING,
                dob: DataTypes.DATEONLY,
                status: DataTypes.TINYINT,
                slug: DataTypes.STRING,
                role_id: DataTypes.INTEGER(11).UNSIGNED,
            },
            {
                modelName: 'User',
                tableName: 'users',
                underscored: true,
                getterMethods: {
                    userable() {
                        switch (this.userable_type) {
                            case 'Admin':
                            case 'admin':
                                return this.getUserableAdmin();
                            case 'Student':
                            case 'student':
                                return this.getUserableStudent();
                        }
                        return null;
                    },
                    
                    async profilePhoto() {
                        let mediaArr = await this.getMedia({
                            where: {
                                group: 1,
                                owner_id: this.id,
                            },
                            limit: 1,
                        });

                        return App.lodash.isEmpty(mediaArr) ? null : App.lodash.head(mediaArr);
                    },
                    
                    async getProfilePhotoUrl() {
                        let media = this.profilePhoto;
                        let updatedAt = '';
                        if(media) {
                            updatedAt = moment(media.updated_at).format('x');
                        }
                        return `${App.env.BASE_URL}/users/${this.slug}/photo?v=${updatedAt}`
                    },
                },
                sequelize
            }
        );
    }

    // ===============================
    // Model Associations
    // ===============================

    static associate(models) {
        // HasOne Relationship b/w User and Admin
        this.getUserableAdmin = models.User.belongsTo(models.Admin, {
            foreignKey: 'userable_id',
            constraints: false,
            as: 'userableAdmin'
        });

        // HasOne Relationship b/w User and Student
        this.getUserableStudent = models.User.belongsTo(models.Student, {
            foreignKey: 'userable_id',
            constraints: false,
            as: 'userableStudent'
        });

        // HasOne Relationship b/w User and Role
        this.getRole = models.User.belongsTo(models.Role, {
            foreignKey: 'role_id',
            constraints: false,
            as: 'role',
        });
        
    }

    // ===============================
    // Model Hooks
    // ===============================

    static hooks(models) {
        models.User.addHook('afterCreate', (user, options) => {
            const middlewares = require('../http/middlewares');
            middlewares.firebaseService.insert(`users/${user.uuid}`, {
                unread_notifications_count: 0
            });
        });
    }

    // ===============================
    // Model Methods
    // ===============================

    // ===============================
    // Instance Methods
    // ===============================

    getType() {
        switch (this.userable_type) {
            case 'Admin':
                return 'admin';
            case 'Student':
                return 'student';
        }
        return null;
    }

    isOfType(type) {
        switch (type) {
            case 'Admin':
            case 'admin':
                return this.getType() == 'admin';
            case 'Student':
            case 'student':
                return this.getType() == 'student';
        }
        return null;
    }

    getUserTypeBooleans() {
        return {
            is_admin: this.isOfType('admin'),
            is_student: this.isOfType('student'),
        };
    }

    getFullName() {
        let str = this.first_name;
        if(this.last_name) {
            str += ` ${this.last_name}`;
        }
        return str;
    }
    
}

// ===============================
// Instance Members
// ===============================
User.fillables = [
    'first_name',
    'last_name',
    'email',
    'password',
    'mobile_number',
    'status',
    'slug',
];
User.hidden = [ 'id', 'password' ];
User.includes = {
    role: {
        as: 'role',
        model: 'role',
        isDefault: false,
        funcName: 'getRole',
    },
};

module.exports = User;