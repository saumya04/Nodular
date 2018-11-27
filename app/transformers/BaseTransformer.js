const ApplicationError = require('../errors/ApplicationError');

class BaseTransformer {

    constructor(req, data, transformOptions = null) {
        if (this.constructor === BaseTransformer) {
            throw new TypeError('Abstract class "BaseTransformer" cannot be instantiated directly.');
        }
        this.req = req;
        this.data = data;
        this.transformOptions = transformOptions;
        this.paramKey = App.helpers.config('settings.transformer.paramKey');
        this.params = req.getParam(this.paramKey);
        this.allQueryParams = (!App.lodash.isEmpty(this.params)) ? this.params.split(',').filter(Boolean) : [];
    }

    async getTimestamps() {
        let syncData = await this.data;
        return {
            created_at: syncData.created_at,
            created_at_formatted: App.helpers.formatDate(syncData.created_at),
            updated_at: syncData.updated_at,
            updated_at_formatted: App.helpers.formatDate(syncData.updated_at),
        };
    }

    init() {
        return this.getAll();
    }

    async getAll() {
        return Promise.all([
            this.transform(this.data),
            this.getTimestamps(),
        ])
            .then(async ([transformed, timestamps]) => {
                let includesData = (App.helpers.getObjProp(this.transformOptions, 'excludeIncludes')) ? {} : await this.getIncludeData();
                return App.helpers.cloneObj(transformed, timestamps, includesData);
            })
    }

    async getIncludeData() {
        this.data = await this.data;
        let finalData = {};
        let allPromise = [];
        let populateStr = App.helpers.getObjProp(this.req.allParams, App.helpers.config('settings.transformer.paramKey'));
        let populateArr = (App.lodash.isString(populateStr)) ? App.lodash.uniq(populateStr.split(',')) : [];
        let includesArr = [];

        App.lodash.forIn(this.model.getIncludes(), (value, key) => {
            if (value.isDefault || App.lodash.indexOf(populateArr, value.as) >= 0) {
                includesArr.push({
                    modelStr: App.helpers.config(`models.${value.model}`),
                    as: value.as,
                    funcName: value.funcName,
                });
            }
        });


        includesArr.forEach(
            async (obj, index, array) => {
                const includeMethod = App.helpers.toCamelCase(`include ${obj.as}`);

                if (App.lodash.isUndefined(this[includeMethod])) {
                    let errorMsg = `${App.helpers.toCamelCase(`include ${obj.as}`)} is not defined in the ${this.constructor.name}`;
                    throw new ApplicationError(errorMsg, 400);
                }

                if (this.data.hasOwnProperty(obj.as) && App.lodash.isUndefined(this.data[obj.as])) {
                    finalData[obj.as] = [];

                    if ((array.length - 1) === index) {
                        allPromise = [...allPromise, finalData]
                    }
                    return;
                }

                let includesDataPromise = [];
                if (App.lodash.isArray(this.data[obj.as])) {
                    includesDataPromise = this.data[obj.as].map(d => {
                        if (includesDataPromise === 'owner') {
                            return this[includeMethod].call(this, this.data.owner_type, d);
                        } else {
                            return this[includeMethod].call(this, d);
                        }
                    });
                } else {
                    if (obj.as === 'owner') {
                        includesDataPromise = [this[includeMethod].call(this, this.data.owner_type, this.data[obj.as])];
                    } else {
                        if (this.data.hasOwnProperty(obj.as)) {
                            includesDataPromise = [this[includeMethod].call(this, this.data[obj.as])];
                        } else {
                            let includeData = this.data[obj.funcName]().then(res => res);
                            this.data[obj.as] = includeData;
                            includesDataPromise = [this[includeMethod].call(this, includeData)];
                        }
                    }
                }

                let intermediatePromise = Promise.all(includesDataPromise)
                    .then((dData) => {
                        return {
                            type: obj.as,
                            data: (App.lodash.isArray(this.data[obj.as])) ? dData : dData.pop()
                        };
                    });

                allPromise = [...allPromise, intermediatePromise];
            }
        );

        return Promise.all(allPromise)
            .then(data => {
                data.forEach(d => {
                    finalData[d.type] = d.data;
                });
                return finalData;
            })
    }

}

module.exports = BaseTransformer;