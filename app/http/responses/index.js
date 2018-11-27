const SuccessResponse = require('./success');
const ErrorResponse = require('./error');
const NoContentResponse = require('./noContent');
const WithMetaResponse = require('./withMeta');

/**
 * Custom responses
 * 
 * res.success(); 
 * res.error(); 
 * res.noContent(); 
 * res.withMeta();
 */
module.exports = function () {
    return {
        success: SuccessResponse.bind(this),
        error: ErrorResponse.bind(this),
        noContent: NoContentResponse.bind(this),
        withMeta: WithMetaResponse.bind(this),
    }
};