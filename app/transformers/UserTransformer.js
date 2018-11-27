const BaseTransformer = require('./BaseTransformer');
const { User } = require('../models');

class UserTransformer extends BaseTransformer {

    constructor(req, data, transformOptions = null) {
        super(req, data, transformOptions);
        this.model = User;
    }

    async transform(user) {
        user = await user;
        let breachedLogs = App.helpers.getObjProp(user, 'logs');
        let owner = await this.getOwner(user);
        // console.log('OWNER--------', user, owner);

        const associationCount = this.getAssociationCount(user) || {};
        const hasPhoto = await user.profilePhoto;
        
        let returnVal = App.helpers.cloneObj({
            type: user.getType(),
            full_name: user.getFullName(),
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            gender_text: App.helpers.config(`settings.user.gender.${user.gender}.text`),
            id: user.uuid,
            email: user.email,
            mobile_number: user.mobile_number,
            dob: user.dob,
            dob_formatted: App.moment(user.dob).format('Do MMM, YYYY'),
            status: user.status,
            status_text: App.helpers.config(`settings.user.status.${user.status}.text`),
            role_id: user.role_id,
            slug: user.slug,

            // ADDING CUSTOM PARAMS
            total_documents_assigned_count: App.helpers.getObjProp(user, 'dataValues.total_documents_assigned_count'),
            pending_documents_count: App.helpers.getObjProp(user, 'dataValues.pending_documents_count'),
            profile_photo_url: await user.getProfilePhotoUrl,
            has_photo: (hasPhoto) ? true : false,
            sla_breached: (breachedLogs && breachedLogs.length > 0) ? true : false,

        }, user.getUserTypeBooleans(), owner, associationCount);

        if(user.getData('last_login_at')) {
            returnVal = App.helpers.cloneObj(returnVal, {
                last_login_at: user.getData('last_login_at'),
                last_login_at_formatted: App.helpers.formatDate(user.getData('last_login_at')),
            });
        }
        
        return returnVal;
    }

    includeRole(data) {
        const RoleTransformer = require('./RoleTransformer');
        return (new RoleTransformer(this.req, data)).init();
    }

    async includeLogs(data) {
        data = await data;
        if(App.lodash.isEmpty(data)) {
            return null;
        }
        const LogTransformer = require('./LogTransformer');
        if(App.lodash.isArray(data)) {
            let returnVal = data.map(async (d) => {
                return await (new LogTransformer(this.req, d, this.transformOptions)).init();
            });
            return await Promise.all(returnVal);
        }
        return (new LogTransformer(this.req, data)).init();
    }

    async getOwner(user) {
        user = await user;
        let userableData = await user.userable;
        let returnData = null;

        switch (user.userable_type) {
            case 'Student':
                const StudentTransformer = require('./StudentTransformer');
                returnData = await (new StudentTransformer(this.req, userableData, this.transformOptions)).init();
                break;

            case 'Admin':
                const AdminTransformer = require('./AdminTransformer');
                returnData = await (new AdminTransformer(this.req, userableData, this.transformOptions)).init();
                break;

            case 'Writer':
                const WriterTransformer = require('./WriterTransformer');
                returnData = await (new WriterTransformer(this.req, userableData, this.transformOptions)).init();
                break;

            case 'WriterManager':
                const WriterManagerTransformer = require('./WriterManagerTransformer');
                returnData = await (new WriterManagerTransformer(this.req, userableData, this.transformOptions)).init();
                break;

            case 'Counsellor':
                const CounsellorTransformer = require('./CounsellorTransformer');
                returnData = await (new CounsellorTransformer(this.req, userableData, this.transformOptions)).init();
                break;

            case 'CounsellorManager':
                const CounsellorManagerTransformer = require('./CounsellorManagerTransformer');
                returnData = await (new CounsellorManagerTransformer(this.req, userableData, this.transformOptions)).init();
                break;



        }
        return {
            owner: returnData,
        }
    }

    getAssociationCount(user) {

        const userable_type = user.userable_type;
        // console.log(App.chalk.inverse.red('####### userable_type'), userable_type);

        let value = {};

        switch (userable_type) {

            case 'Counsellor':
                try {
                    value['students_count'] = user.userableCounsellor.counsellor_students[0].dataValues.students_count;
                } catch (e) {
                    return false;
                }
                return value;

            case 'CounsellorManager':

                try {
                    value['counsellors_count'] = user.userableCounsellorManager.counsellors[0].dataValues.counsellors_count;

                } catch (e) {
                    return false;
                }
                return value;

            case 'WriterManager':

                try {
                    value['writers_count'] = user.userableWriterManager.writers[0].dataValues.writers_count;

                } catch (e) {
                    return false;
                }
                return value;

            case 'Writer':

                try {
                    value['students_count'] = user.dataValues.assigned_student_count;

                } catch (e) {
                    return false;
                }
                return value;

            case 'Student':
                try {
                    // console.log(App.chalk.inverse.red('2121'),  user.userableStudent.shortlisted_student_programs[0].dataValues);
                    // console.log(App.chalk.inverse.red('2122'),  user.userableStudent.shortlisted_student_programs[0].dataValues.college_program.dataValues);
                    //  user.userableStudent.shortlisted_student_programs[0].dataValues.college_program[0]);
                    const nearest_deadline = user.userableStudent.shortlisted_student_programs[0].dataValues.college_program.dataValues.nearest_deadline;
                    value['nearest_deadline'] = App.moment(nearest_deadline).format('Do MMM, YYYY')

                } catch (e) {
                    return false;
                }
                return value;

        }

    }

}

module.exports = UserTransformer;