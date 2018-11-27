module.exports = function (app) {
    app.use((req, res, next) => {
        const responses = require('../responses').call({ req, res });
        for (let key in responses) {
            res[key] = responses[key];
        }
        next();
    });
}