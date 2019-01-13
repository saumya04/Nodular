const Sequelize = require("sequelize");
require('dotenv').config();
var env = process.env || {};

const UserModel = require('./User');
const StudentModel = require('./Student');
const RoleModel = require('./Role');
const AdminModel = require('./Admin');

const sequelize = new Sequelize(env.DB_DATABASE, env.DB_USERNAME, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: env.DB_CONNECTION,
    operatorsAliases: false,
    timezone: "+05:30", // timezone for writing to the db
    dialectOptions: {
        dateStrings: true, // disable mysql conversion
        typeCast: true // Overwrite the sequelize conversion, look at the code, currently only affects date and GEOMETRY, can be used
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

const db = {
    User: UserModel.init(sequelize, Sequelize),
    Student: StudentModel.init(sequelize, Sequelize),
    Admin: AdminModel.init(sequelize, Sequelize),
    Role: RoleModel.init(sequelize, Sequelize),
};

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(db)
    .filter(model => typeof model.associate === "function")
    .forEach(model => model.associate(db));

// Run `.addHook/hooks` if it exists,
// ie create observers/model-event based actions in the ORM
Object.values(db)
    .filter(model => typeof model.hooks === "function")
    .forEach(model => model.hooks(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;