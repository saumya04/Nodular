module.exports = function (data = {}, statusCode = 200) {

    // Get access to `req` and `res`
    var req = this.req;
    var res = this.res;

    // Log a message, if desired.
    // sails.log('Ran custom response: res.withMeta()');

    // If no data was provided, use res.sendStatus().
    if (App.lodash.isUndefined(data)) {
        return res.sendStatus(statusCode);
    }

    if (App.lodash.isError(data)) {
        // If the provided data is an Error instance, then log it as verbose.
        sails.log.verbose('Custom response `res.foobar()` called with an Error:', data);

        // If the error doesn't have a custom .toJSON(), use its `stack` instead--
        // otherwise res.json() would turn it into an empty dictionary.
        // (If this is production, don't send a response body at all.)
        if (!App.lodash.isFunction(data.toJSON)) {
            if (process.env.NODE_ENV === 'production') {
                return res.sendStatus(statusCode);
            }
            else {
                res.status(statusCode);
                return res.send(data.stack);
            }
        }
    }

    // Set status code and send response data.
    res.status(statusCode);
    return res.json({
        code: statusCode,
        meta: (data.meta) ? data.meta : null,
        data: (data.data) ? data.data : []
    });

};
