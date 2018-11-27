const ApiRoutes = require('./api');
const WebRoutes = require('./web');
const express = require('express');
const middlewares = require('../app/http/middlewares');
const asyncHandler = require('express-async-handler');

module.exports =  {

        web: {
            prefix: '/',
            routes: () => processRoutes(WebRoutes),
        },

        api: {
            prefix: '/api/v1',
            routes: () => processRoutes(ApiRoutes, []),
        },

}

function processRoutes(route, globalMiddlewares = []) {
    const Router = express.Router();

    for(let routeKey in route) {
        let middlewareArr = [];
        let routeMiddlewareArr = App.lodash.uniq(route[routeKey]['middlewares'].concat(globalMiddlewares));
        for(let middlewareIndex in routeMiddlewareArr) {
            let middleware = getComputedMiddleware(App.helpers.getObjProp(routeMiddlewareArr, middlewareIndex));
            if(middleware) {
                middlewareArr.push(asyncHandler(middleware));
            }
        }

        // For error handling in async operations
        let action = asyncHandler(route[routeKey]['action']);

        let routeKeyArr = routeKey.split(' ');
        
        switch(routeKeyArr[0]) {
            case 'GET':
                Router.get(`/${routeKeyArr[1]}`, middlewareArr, action);
                break;

            case 'POST':
                Router.post(`/${routeKeyArr[1]}`, middlewareArr, action);
                break;

            case 'PUT':
                Router.put(`/${routeKeyArr[1]}`, middlewareArr, action);
                break;

            case 'PATCH':
                Router.patch(`/${routeKeyArr[1]}`, middlewareArr, action);
                break;

            case 'DELETE':
                Router.delete(`/${routeKeyArr[1]}`, middlewareArr, action);
                break;
        }
    }
    return Router;
}

function getComputedMiddleware(middlewareStr) {
    if(! App.lodash.isString(middlewareStr)) {
        return null;
    }

    let middlewareStrArr = middlewareStr.split(':');
    let middlewareName = middlewareStrArr[0];

    if(middlewareStrArr.length == 2) {
        let middlewareArgs = middlewareStrArr[1];
        let argsArr = middlewareArgs.split('|');
        let middlewareMethod = App.helpers.getObjProp(middlewares, middlewareName);
        return middlewareMethod(...argsArr);
    }

    return App.helpers.getObjProp(middlewares, middlewareStr);
}