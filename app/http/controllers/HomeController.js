const AWS = require('aws-sdk');
const AwsService = require('../../utilities/AWS/AwsService');

module.exports = {

    /**
     * index /
     * Index web route.
     */
    index: (req, res) => {
        res.send("Welcome to nodular App");
    },

    test: async (req, res) => {
        return res.success({ message: 'This is a testing route'} );
    },

}