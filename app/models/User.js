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
                last_login_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                }
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
                            case 'CounsellorManager':
                            case 'counsellor-manager':
                                return this.getUserableCounsellorManager();
                            case 'Counsellor':
                            case 'counsellor':
                                return this.getUserableCounsellor();
                            case 'WriterManager':
                            case 'writer-manager':
                                return this.getUserableWriterManager();
                            case 'Writer':
                            case 'writer':
                                return this.getUserableWriter();
                        }
                        return null;
                        // return this.getUserableStudent();
                        // return this[
                        //     'getUserable' +
                        //     this.get('userable_type').substr(0, 1).toUpperCase() +
                        //     this.get('userable_type').substr(1)
                        // ]();
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

        // HasOne Relationship b/w User and CounsellorManager
        this.getUserableCounsellorManager = models.User.belongsTo(models.CounsellorManager, {
            foreignKey: 'userable_id',
            constraints: false,
            as: 'userableCounsellorManager'
        });

        // HasOne Relationship b/w User and Counsellor
        this.getUserableCounsellor = models.User.belongsTo(models.Counsellor, {
            foreignKey: 'userable_id',
            constraints: false,
            as: 'userableCounsellor'
        });

        // HasOne Relationship b/w User and WriterManager
        this.getUserableWriterManager = models.User.belongsTo(models.WriterManager, {
            foreignKey: 'userable_id',
            constraints: false,
            as: 'userableWriterManager'
        });

        // HasOne Relationship b/w User and Writer
        this.getUserableWriter = models.User.belongsTo(models.Writer, {
            foreignKey: 'userable_id',
            constraints: false,
            as: 'userableWriter'
        });

        // HasOne Relationship b/w User and Role
        this.getRole = models.User.belongsTo(models.Role, {
            foreignKey: 'role_id',
            constraints: false,
            as: 'role',
        });

        // HasMany Relationship b/w User and DatabaseNotification
        this.getDbNotifications = models.User.hasMany(models.DatabaseNotification, {
            foreignKey: 'notifiable_id',
            constraints: false,
            scope: {
                notifiable_type: 'User'
            },
            as: 'database_notifications',
        });

        // HasMany Relationship b/w User and Media
        this.getMedia = models.User.hasMany(models.Media, {
            foreignKey: 'owner_id',
            constraints: false,
            scope: {
                owner_type: 'User',
            },
            as: 'media',
        });

        // HasMany relationship b/w fcm token and users
        this.getFcm_tokens = models.User.hasMany(models.FcmToken, {
            foreignKey: 'user_id',
            constraints: false,
            as: 'fcm_tokens',
        });

        // HasMany Relationship b/w User and DatabaseNotification
        this.getLogs = models.User.hasMany(models.Log, {
            foreignKey: 'from_id',
            constraints: false,
            as: 'logs',
        });
        
    }

    // ===============================
    // Model Hooks
    // ===============================

    static hooks(models) {
        models.User.hook('afterCreate', (user, options) => {
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
            case 'CounsellorManager':
                return 'counsellor-manager';
            case 'Counsellor':
                return 'counsellor';
            case 'WriterManager':
                return 'writer-manager';
            case 'Writer':
                return 'writer';
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
            case 'CounsellorManager':
            case 'counsellor-manager':
                return this.getType() == 'counsellor-manager';
            case 'Counsellor':
            case 'counsellor':
                return this.getType() == 'counsellor';
            case 'WriterManager':
            case 'writer-manager':
                return this.getType() == 'writer-manager';
            case 'Writer':
            case 'writer':
                return this.getType() == 'writer';
        }
        return null;
    }

    getUserTypeBooleans() {
        return {
            is_admin: this.isOfType('admin'),
            is_student: this.isOfType('student'),
            is_writer: this.isOfType('writer'),
            is_counsellor: this.isOfType('counsellor'),
            is_writer_manager: this.isOfType('writer-manager'),
            is_counsellor_manager: this.isOfType('counsellor-manager'),
        };
    }

    getFullName() {
        let str = this.first_name;
        if(this.last_name) {
            str += ` ${this.last_name}`;
        }
        return str;
    }

    getFcmTokensArr() {
        return this.getFcm_tokens().then((tokens) => {
            if(! App.helpers.isEmpty(tokens)) {
                let allTokens = tokens.filter((t) => ! App.helpers.isEmpty(t.token))
                                    .map((t) => t.token);
                return App.lodash.uniq(allTokens);
            }
            return [];
        });
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
    // only for student
    'dob',
    'gender'
    // 'userable_id',
    // 'userable_type',
    // 'slug',
    // 'role_id',
];
User.hidden = [ 'id' ];
User.includes = {
    role: {
        as: 'role',
        model: 'role',
        isDefault: false,
        funcName: 'getRole',
    },
    database_notifications: {
        as: 'database_notifications',
        model: 'database_notification',
        isDefault: false,
        funcName: 'getDabatase_notification',
    },
    fcm_tokens: {
        as: 'fcm_tokens',
        model: 'fcm_token',
        isDefault: false,
        funcName: 'getFcm_tokens',
    },
    logs: {
        as: 'logs',
        model: 'log',
        isDefault: false,
        funcName: 'getLogs',
    },
    // userableCounsellor: {
    //     as: 'userableCounsellor',
    //     model: 'counsellor',
    //     isDefault: false,
    //     funcName: 'getUserableCounsellor'
    // },
};

module.exports = User;