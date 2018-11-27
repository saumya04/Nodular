const { User, Student, Enrolment, Roadmap } = require("../models");

const UserRepository = require("../repositories/UserRepository");
const StudentRepository = require("../repositories/StudentRepository");
const RoleRepository = require("../repositories/RoleRepository");
const CounsellorStudentRepository = require("../repositories/CounsellorStudentRepository");
const MediaRepository = require('../repositories/MediaRepository');
const LogRepository = require('../repositories/LogRepository');
const EnrolmentRepository = require('../repositories/EnrolmentRepository');
const RoadmapRepository = require('../repositories/RoadmapRepository');
const DatabaseNotificationRepository = require('../repositories/DatabaseNotificationRepository');

const StudentValidator = require("../validators/StudentValidator");
const UserValidator = require("../validators/UserValidator");

const studentConfig = require('../../config/settings').userable_types.student;
const FormData = require('../utilities/FormData');
const sequelize = require('sequelize');
const Op = sequelize.Op;

class StudentService {
    /**
     * Initializing common properties
     */
    constructor(req) {
        this.req = req;

        this.userValidator = new UserValidator();
        this.studentValidator = new StudentValidator();
        
        this.userRepo = new UserRepository(req);
        this.roleRepo = new RoleRepository(req);
        this.studentRepo = new StudentRepository(req);
        this.dbNotificationRepo = new DatabaseNotificationRepository(req);
        this.formData = new FormData(req);
    }

    async get(studentId) {
        let {
            studentUser,
        } = App.helpers.getReqMetaData(this.req);

        studentUser = studentUser || await this.userRepo.getBy({
            userable_type: studentConfig.value,
            [Op.or]: [
                {
                    slug: studentId
                }, {
                    uuid: studentId
                }
            ]
        }, true);

        return studentUser;
    }

}

module.exports = StudentService;
