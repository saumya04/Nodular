module.exports = function () {

    // Get access to `req` and `res`
    var req = this.req;
    var res = this.res;

    // Set status code and send response data.
    res.status(204);
    return res.json(null);

};
