const AuthValidator = require("../validators/AuthValidator");
const UserRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");
const GenericError = require("../errors/GenericError");
const Models = require('../models');
const sequelize = Models.sequelize;
const Op = sequelize.Op;
const Mail = require('../utilities/mail/Mail');
const ejs = require("ejs");
const path = require("path");
const jwt = require('jsonwebtoken');

class AuthService {
    /**
     * Initializing common properties
     */
    constructor(req) {
        this.req = req;
        this.authValidator = new AuthValidator();
        this.userRepo = new UserRepository(req);
    }

    /**
     * Authenticate user for passed credentials
     * @param {Object} params
     */
    async login(inputs) {

        let validInputs = await this.authValidator.validate(inputs, "signin");
        let authType = App.helpers.config('settings.authType.nodular');

        let userable = {
            email: validInputs.email,
            userable_type: {
                [Op.not]: "Student"
            }
        };

        const requestedAuthType = App.helpers.getObjProp(inputs, 'authType').toLowerCase();

        if ( requestedAuthType == App.helpers.config('settings.authType.student')) {
            userable = {
                email: validInputs.email,
                userable_type: "Student"
            };
            authType = App.helpers.config('settings.authType.student');
        }
        
        // validating authType
        if (requestedAuthType != authType) {
            throw new GenericError("Invalid Credentials!", 400);
        }
        
        let user = await this.userRepo.getWhere(userable).then(users => {
            return users ? users[0] : null;
        });

        if (!user) {
            throw new GenericError("Invalid Credentials!", 400);
        }

        const match = await bcrypt.compare(
            validInputs.password,
            user.getData("password")
        );

        if (! match) {
            throw new GenericError("Invalid Credentials!", 400);
        }

        // Updating 'last_login_at' for the user
        this.userRepo.update({
            last_login_at: new Date(),
        }, {
            where: {
                id: user.id,
            }
        });

        return user;
    }

    /**
     * Authenticates & Send email to user for resetting password
     * (Forgot Password Functionality)
     * 
     * @param {Object} params
     */
    async forgotPassword(inputs) {
        let validInputs = await this.authValidator.validate(inputs, "forgot-password");
        
        let user = await this.userRepo.getBy({
            email: App.helpers.getObjProp(validInputs, 'email'),
        });
        
        if(App.helpers.isEmpty(user)) {
            throw new GenericError("Invalid email ID!");
        }

        const token = App.helpers.getEncryptedStr(user.getData('id'));
        this.sendResetPasswordEmailToUser(user.getData(), token);
        return;
    }

    /**
     * Send email to user for resetting password
     * (Forgot Password Functionality)
     * 
     * @param {Object} params
     */
    async sendResetPasswordEmailToUser(user, token) {
        let mailData = {
            user: user,
            logoUrl: `${App.env.ADMIN_APP_URL}/assets/images/logo.png`,
            resetLink: `${App.env.ADMIN_APP_URL_WITH_HASH}/pages/reset-password/${token}`,
        };

        return ejs.renderFile(
            path.resolve(App.paths.views, 'emails/auth/reset-password.ejs'),
            mailData,
            (err, data) => {
                if(err) {
                    return err;
                }

                const mailer = new Mail();
                mailer.send({
                    to: user.email,
                    subject: `nodular | Forgot Password`,
                    html: data,
                });
            }
        );
    }

    /**
     * Reset Password
     * (Reset Password Functionality)
     * 
     * @param {Object} params
     */
    async resetPassword(inputs) {
        let validInputs = await this.authValidator.validate(inputs, "reset-password");
        const decryptedObj = App.helpers.getDecryptedData(validInputs.token);
        
        let user = await this.userRepo.getBy({
            id: App.helpers.getObjProp(decryptedObj, 'id'),
        });

        if(App.helpers.isEmpty(user)) {
            throw new GenericError("Invalid token passed!");
        }

        let now = App.moment();
        let old = App.moment(App.helpers.getObjProp(decryptedObj, 'timestamp'));
        if(now.diff(old, 'hours') > App.helpers.config('settings.resetPassword.expiryTime')) {
            throw new GenericError("The passed token has been expired!");
        }

        const password = await App.helpers.bcryptPassword(validInputs.password);
        await this.userRepo.update({ password }, {
            where: { id: user.id },
        });
        return;
    }

    async logout(jwtToken, params) {
        const decodedToken = jwt.verify(jwtToken, App.env.JWT_SECRET);
        const decodedUserId = App.helpers.getObjProp(decodedToken, "id");
        const user = await this.userRepo.get(decodedUserId, false);

        if(App.helpers.getObjProp(params, 'fcm_token')) {
            // Removing FCM tokens sent in the request
            user.getFcm_tokens({
                where: {
                    token: params.fcm_token,
                },
            }).then((fcmTokens) => {
                if(! App.helpers.isEmpty(fcmTokens)) {
                    this.fcmTokenRepo.delete({
                        where: {
                            id: {
                                [Op.in]: fcmTokens.map(t => t.id),
                            }
                        }
                    }).then((deletedRecords) => {
                        console.log(`Deleted ${deletedRecords} FCM token(s) for user id: ${user.id}`);
                    });
                }
            });
        }
        
        return user;
    }
}

module.exports = AuthService;
