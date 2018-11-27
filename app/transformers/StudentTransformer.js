const BaseTransformer = require('./BaseTransformer');
const { Student } = require('../models');

class StudentTransformer extends BaseTransformer {

    constructor(req, data, transformOptions = null) {
        super(req, data, transformOptions);
        this.model = Student;
    }

    async transform(student) {
        student = await student;
        let returnVal = App.helpers.cloneObj({
            // enrolment_id: student.enrolment_id,
            // package_id: student.package_id,
            id: student.uuid,
            status: student.status,
            status_text: App.helpers.config(`settings.student.status.${student.status}.text`),
            state: student.state,
            state_text: App.helpers.config(`settings.student.state.${student.state}.text`),
            balance: student.balance,
            // roadmap: student.roadmap
        });

        if(student.getData('package_deadline')) {
            returnVal = App.helpers.cloneObj(returnVal, {
                package_deadline: student.getData('package_deadline'),
                package_deadline_formatted: App.helpers.formatDate(student.getData('package_deadline'))
            });
        }

        return returnVal;
    }

    includePackage(data) {
        const PackageTransformer = require('./PackageTransformer');
        return (new PackageTransformer(this.req, data)).init();
    }

    async includeEnrolment(data) {
        data = await data;
        if(App.lodash.isEmpty(data)) {
            return null;
        }
        const EnrolmentTransformer = require('./EnrolmentTransformer');
        return (new EnrolmentTransformer(this.req, data)).init();
    }

    async includeCounsellors(data) {
        data = await data;
        if(App.lodash.isEmpty(data)) {
            return null;
        }
        const UserTransformer = require('./UserTransformer');
        if(App.lodash.isArray(data)) {
            let returnVal = data.map(async (d) => {
                let user = await d.getUser();
                return await (new UserTransformer(this.req, user, this.transformOptions)).init();
            });
            return await Promise.all(returnVal);
        }
        return (new UserTransformer(this.req, users)).init();
    }

    async includeRoadmap(data) {
        data = await data;
        const RoadmapTransformer = require("./RoadmapTransformer");
        return (new RoadmapTransformer(this.req, data, this.transformOptions)).init();
    }

    async includeCounsellorManagers(data) {
        data = await data;
        if(App.lodash.isEmpty(data)) {
            return null;
        }
        const UserTransformer = require('./UserTransformer');
        if(App.lodash.isArray(data)) {
            let returnVal = data.map(async (d) => {
                let user = await d.getUser();
                return await (new UserTransformer(this.req, user, this.transformOptions)).init();
            });
            return await Promise.all(returnVal);
        }
        return (new UserTransformer(this.req, users)).init();
    }

}

module.exports = StudentTransformer;