const Student = require('../models').Student;
const BaseRepository = require('./BaseRepository');

class StudentRepository extends BaseRepository {

    constructor(req) {
        super();
        this.req = req;
        this.model = Student;
    }

}

module.exports = StudentRepository;