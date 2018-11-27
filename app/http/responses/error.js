module.exports = function(data = {}, statusCode = 400, customCode = null) {

    // Get access to `req` and `res`
    const req = this.req;
    const res = this.res;

    let responseData = {
        code: (customCode) ? customCode : statusCode,
        message: null
    }

    if (App.lodash.isObject(data)) {

        if (data.hasOwnProperty('message')) {
            responseData.message = data.message;
        }
        if (data.hasOwnProperty('errors')) {
            responseData.errors = data.errors;
        }

    }

    res.status(statusCode);
    return res.json(responseData);

};