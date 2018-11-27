const Models = require('../models');
const Transformers = require('./index');
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
        // console.log('param key', this.paramKey, this.params);
        this.allQueryParams = (! App.lodash.isEmpty(this.params)) ? this.params.split(',').filter(Boolean) : [];
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
        // let includesData = await this.getIncludeData();
        return Promise.all([
            this.transform(this.data),
            this.getTimestamps(),
            // this.getIncludeData(),
        ])
        .then(async ([transformed, timestamps]) => {
            let includesData = (App.helpers.getObjProp(this.transformOptions, 'excludeIncludes')) ? {} : await this.getIncludeData();
            // console.log('includesData: ', includesData, App.helpers.cloneObj(transformed, timestamps, includesData));
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
            if(value.isDefault || App.lodash.indexOf(populateArr, value.as) >= 0) {
                includesArr.push({
                    modelStr: App.helpers.config(`models.${value.model}`),
                    as: value.as,
                    funcName: value.funcName,
                });
            }
        });


        includesArr.forEach(
            async (obj, index, array) => {
                // console.log(App.chalk.inverse.red('includes obj........'), obj);
                let transformerObj = Transformers[obj.modelStr];
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
                            includesDataPromise = [ this[includeMethod].call(this, this.data[obj.as]) ];
                        } else {
                            // console.log('991', obj);
                            // this.data = await this.data;
                            // console.log('obj.funcName---------->', obj.funcName, this.data)
                            let includeData = this.data[obj.funcName]().then(res => res);
                            this.data[obj.as] = includeData;
                            // if(App.lodash.isArray(includeData)) {
                            //     includesDataPromise = [];
                            //     let prArr = includeData.map(async (d) => {
                            //         return await this[includeMethod].call(this, d);
                            //     });
                            //     includesDataPromise = [prArr];
                            // } else {
                            //     // includesDataPromise = [includeData];
                            // }
                            includesDataPromise = [ this[includeMethod].call(this, includeData) ];
                        }
                    }
                }

                let intermediatePromise = Promise.all(includesDataPromise)
                    .then((dData) => {
                        // console.log('$$$$$$$$$$$$$', obj.as, dData);
                        return {
                            type: obj.as,
                            data: (App.lodash.isArray(this.data[obj.as])) ? dData : dData.pop()
                        };
                    });

                // allPromise = this[includeMethod].call(this, this.data.dataValues[obj.as]);
                allPromise = [ ...allPromise, intermediatePromise ];
            }
        );

        // console.log('--------------><--------------', allPromise.length);
        
        return Promise.all(allPromise)
            .then(data => {
                // console.log('FINAL DATA--------->', data);
                data.forEach(d => {
                    // console.log('d.type--------->', d.type);
                    // finalData[d.type] = (d.data.length === 1) ? d.data.pop() : d.data;
                    finalData[d.type] = d.data;
                });
                return finalData;
            })
    }

}

module.exports = BaseTransformer;