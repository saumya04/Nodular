const { UserTransformer } = require('../../transformers');
const BaseNotificationTask = require('./BaseNotificationTask');

class StudentFilledCollegeLoginDetails extends BaseNotificationTask {

    constructor(req, data) {
        super(req, data);
        
        this.userStudent = App.helpers.getObjProp(data, 'userStudent');
    }

    async getData() {
        let studentTransformedData = await this.getTransformedData(this.req, this.userStudent, UserTransformer);
        
        return {
            studentUser: studentTransformedData,
        };
    }

}

module.exports = StudentFilledCollegeLoginDetails;