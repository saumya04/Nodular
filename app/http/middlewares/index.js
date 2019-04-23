const AuthMiddleware = require('./auth');
const ApiSecretMiddleware = require('./api-secret');
const GeneralMiddleware = require('./general');
const ResponseMacroMiddleware = require('./responses');
const RequestInterceptorMiddleware = require('./request-interceptor');
const SessionMiddleware = require('./session');
const UserLoginMiddleware = require('./user-login');
const HasRole = require('./has-role');

// Policies
const StudentPolicy = require('./policies/student.policy');
const AdminPolicy = require('./policies/admin.policy');

module.exports = {

    general: GeneralMiddleware,
    responses: ResponseMacroMiddleware,
    session: SessionMiddleware,
    apiSecret: ApiSecretMiddleware,
    requestInterceptor: RequestInterceptorMiddleware,
    hasRole: HasRole,
    auth: {
        jwt: AuthMiddleware.jwt,
        userLogin: UserLoginMiddleware,
    },
    policy: {
        admin: AdminPolicy,
        student: StudentPolicy,
    }

};