var Validator = require('./Validator');

class UserValidator extends Validator {

    /**
     * Validation rules.
     *
     * @param  string type
     * @param  array data
     * @return Object
     */
    getRules(type, data = {}) {

        let rules = {};

        switch (type) {

            case 'signin':
                rules = {
                    email: 'required',
                    password: 'required|min:6',
                    userType: 'required|in:user,admin'
                };
                break;

            case 'update':
                rules = {
                    file: 'mimeTypes:image/png,image/jpeg|imageSize:1000000',
                    // dob: 'date:format=YYYY-MM-DD,after=' + App.moment().format('YYYY-MM-DD'),
                    status: 'numeric|between:0,1',
                    email: `unique:User,email,${data.except.email}`,
                    password: 'min:6',
                    mobile_number: `unique:User,mobile_number,${data.except.mobile_number}|digits:10`,
                };
                break;

            case 'create':
                rules = {
                    // file: 'mimeTypes:image/png,image/jpeg|imageSize:2000000|dimensions:min_width=600,min_height=500',
                    file: 'mimeTypes:image/png,image/jpeg|imageSize:1000000',
                    first_name: 'required|string|max:255',
                    last_name: 'required|string|max:255',
                    email: `unique:User,email|email`,
                    password: 'required|min:6|max:255',
                    mobile_number: 'required|numeric|unique:User,mobile_number|digits:10',
                    // dob: 'required|date:format=YYYY-MM-DD,after=' + App.moment().format('YYYY-MM-DD'),
                };
                break;

            case 'create-student-user':
                rules = {
                    file: 'mimeTypes:image/png,image/jpeg|imageSize:1000000',
                    first_name: 'required|string|max:255',
                    last_name: 'required|string|max:255',
                    email: `unique:User,email|email`,
                    password: 'required|min:6|max:255',
                    mobile_number: 'required|numeric|unique:User,mobile_number|digits:10',
                    // only for student
                    dob: 'required|date:format=YYYY-MM-DD,after=' + App.moment().format('YYYY-MM-DD'),
                    gender: 'required|between:0,1'
                }
                break;

            case 'update-student-user':
                rules = {
                    file: 'mimeTypes:image/png,image/jpeg|imageSize:1000000',
                    status: 'numeric|between:0,1',
                    email: `unique:User,email,${data.except.email}`,
                    password: 'min:6',
                    mobile_number: `unique:User,mobile_number,${data.except.mobile_number}|digits:10`,
                    // only for student
                    dob: 'date:format=YYYY-MM-DD,after=' + App.moment().format('YYYY-MM-DD'),
                    gender: 'between:0,1'
                }
                break;

            case 'update-fcm-token':
                rules = {
                    user_id: 'required',
                    token: 'required',
                    // device_id: 'required',
                    device_type: 'required|in:1,2,3',
                };
                break;

            case 'create-student-from-csv':
                rules = {
                    first_name: 'required|string|max:255',
                    last_name: 'required|string|max:255',
                    email: `required|unique:User,email`,
                    password: 'required|min:6|max:255',
                    mobile_number: 'required|numeric|unique:User,mobile_number|digits:10',
                    dob: 'required|date:format=YYYY-MM-DD,after=' + App.moment().format('YYYY-MM-DD'),
                    package_id: 'required|exist:Package,id',
                };
                break;

        }

        return rules;
    }


}

module.exports = UserValidator;
