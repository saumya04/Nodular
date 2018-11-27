const Validator = require('./Validator');

class AuthValidator extends Validator {

    /**
     * Validation rules.
     *
     * @param  string type
     * @param  array data
     * @return Object
     */
    getRules(type, data = []) {
        let rules = {};

        switch (type) {

            case 'signin':
                rules = {
                    email: 'required',
                    password: 'required|min:6',
                    authType: 'required|in:client,business',
                };
                break;

            case 'forgot-password':
                rules = {
                    email: 'required|email',
                };
                break;

            case 'reset-password':
                rules = {
                    token: 'required',
                    password: 'required',
                    confirm_password: 'required|same:password',
                };
                break;

        }

        return rules;
    }

}

module.exports = AuthValidator;