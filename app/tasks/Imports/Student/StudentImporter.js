const UserValidator = require('../../../validators/UserValidator');
// const StudentService = require('../../../services/StudentService');
const ConversationService = require('../../../services/ConversationService');
const BaseImporter = require('../BaseImporter');

class StudentImporter extends BaseImporter {

    constructor(req, file) {
        super(req, file);
        this.validator = new UserValidator(req);
        console.log('-------------StudentService-------------');
    }

    async runTask(inputs) {
        console.log('--------------> runTask [inputs]', inputs);
        const StudentService = require('../../../services/StudentService');
        let user = await new StudentService(this.req).create(inputs, false);
        let conversations = await new ConversationService(this.req).createConversationsForNewUser(user.id);
        return { user, conversations };
    }

    async validate(inputs, row_id) {
        try {
            console.log('============================');
            console.log('Validate Errors');
            console.log('============================');
            await this.validator.validate(inputs, 'create-student-from-csv');
        } catch(e) {
            console.log('============================');
            console.log('Errors Catched');
            console.log('============================');
            console.log(e.errors);
            return e.errors;
        }
    }

}

module.exports = StudentImporter;