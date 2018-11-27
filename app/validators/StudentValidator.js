var Validator = require('./Validator');

class StudentValidator extends Validator {

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

            case 'create':
                rules = {
                    package_id: 'required|exist:Package,id',
                };
                break;

            case 'update':
                rules = {
                    package_id: 'exist:Package,id',
                    student_status: 'numeric|between:0,6',
                    // enrolment_id: 'numeric|exist:Enrolment,id',
                    student_state: 'between:0,6',
                    // roadmap: 'student_roadmap'
                    // package_id: 'exist:Package,id',
                    // student_status: 'numeric|between:0,6',
                    // enrolment_id: 'numeric|exist:Enrolment,id',
                    // student_state: 'student_status,enrolment_id|between:0,6'
                };
                break;

            case 'update-shortlisted-student-program':
                rules = {
                    program_checklists: 'json_format:program_checklist',
                    is_approved_by_student: `boolean`,
                    status: 'numeric:between:0,4',
                };
                break;

            case 'create-my-college':
                rules = {
                    college_name: 'required|max:255',
                    program_name: 'required|max:255',
                };
                break;

            case 'update-student-program-document':
                rules = {
                    document_sessions: 'student_program_document_sessions',
                };
                break;

            case 'enrolment':
                rules = {
                    gmat_score: 'required',
                    toefl_score: 'required',
                    country: 'required',
                    previously_enrolled: 'required',
                    previously_enrolled_course: 'required',
                    known_about_us: 'required',
                    desired_course_details: 'required',
                    contact_details: 'required',
                    education_details: 'required',
                    test_details: 'required',
                    current_employment_details: 'required',
                    internship_experiences: 'required',
                    extra_curricular_details: 'required',
                    other_details: 'required'
                }
                break;

        }

        return rules;
    }


}

module.exports = StudentValidator;
