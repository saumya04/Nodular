const { UserTransformer, CollegeProgramTransformer, ShortlistedStudentProgramTransformer } = require('../../transformers');
const BaseNotificationTask = require('./BaseNotificationTask');

class StudentFilledCollegeLoginDetails extends BaseNotificationTask {

    constructor(req, data) {
        super();
        this.req = req;
        
        this.userStudent = App.helpers.getObjProp(data, 'userStudent');
        this.collegeProgram = App.helpers.getObjProp(data, 'collegeProgram');
        this.shortlistedStudentProgram = App.helpers.getObjProp(data, 'shortlistedProgram');
    }

    async getData() {
        let studentTransformedData = await this.getTransformedData(this.req, this.userStudent, UserTransformer);
        
        let collegeProgramTransformedData = await this.getTransformedData(
            this.req, this.collegeProgram, CollegeProgramTransformer
        );

        let shortlistedStudentProgramTransformedData = await this.getTransformedData(
            this.req, this.shortlistedStudentProgram, ShortlistedStudentProgramTransformer
        );
        
        return {
            studentUser: studentTransformedData,
            college: collegeProgramTransformedData,
            shortlistedStudentProgram: shortlistedStudentProgramTransformedData
        };
    }

}

module.exports = StudentFilledCollegeLoginDetails;