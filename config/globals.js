const lodash = require('lodash');
const Helper = require('../app/helpers/helpers');
const Chalk = require('chalk');
const moment = require('moment');
const path = require('path');
require('dotenv').config();
var env = process.env || {};
const sequelize = require('sequelize');

module.exports = {

    lodash: lodash,

    helpers: Helper,

    chalk: Chalk,

    moment: moment,

    env: env,

    sequelize: sequelize,

    paths: {
        root: path.resolve(__dirname, '../'),
        public: path.resolve(__dirname, '../public'),
        views: path.resolve(__dirname, '../views'),
        storage: path.resolve(__dirname, '../', 'storage'),
        s3: {
            bucket: env.AWS_S3_BUCKET
        }
    },

}