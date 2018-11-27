const RepositoryContract = require('../contracts/RepositoryContract');
const ModelNotFoundError = require('../errors/ModelNotFoundError')
const Models = require('../models');
const sequelize = Models.sequelize;

class BaseRepositoryContract extends RepositoryContract {

    constructor(props) {
        super(props);
    }

    /**
     * Get model object(s) for the criteria passed
     *
     * @param {Object}  criteria
     * @param {boolean} multiple
     */
    getFor(criteria, multiple = true, populate = true) {
        if (populate) {
            criteria = this.processPopulate(criteria, populate);
        }

        return (multiple) ?
            this.model.findAll(criteria) :
            this.model.findOne(criteria);
    }

    /**
     * Update the model by the given attributes.
     *
     * @param Object attributesToUpdate
     * @param Object findCriteria
     * @return mixed
     */
    update(attributesToUpdate, findCriteria = {}) {
        return this.model.update(attributesToUpdate, findCriteria)
            .then(res => res);
    }

    /**
     * Save model attributes.
     *
     * @param {Object} findCriteria
     * @param {Object} attributesToUpdate
     * @return mixed
     */
    save(modelObj, attributesToUpdate = { update: {}, add: {}, remove: {} }, saveOptions = {}, populate = false) {
        let tempVal = null;
        // Checking for 'add' params
        if (attributesToUpdate.hasOwnProperty('add')) {
            tempVal = attributesToUpdate['add'];

            for (let prop in tempVal) {
                modelObj[prop].add(tempVal[prop]);
            }
        }

        // Checking for 'remove' params
        if (attributesToUpdate.hasOwnProperty('remove')) {
            tempVal = attributesToUpdate['remove'];

            for (let prop in tempVal) {
                if (App.lodash.isArray(tempVal[prop])) {
                    tempVal[prop].forEach(
                        (arrVal) => {
                            modelObj[prop].remove(arrVal);
                        }
                    );
                } else {
                    modelObj[prop].remove(tempVal[prop]);
                }
            }
        }

        // Checking for 'update' params
        if (attributesToUpdate.hasOwnProperty('update')) {
            tempVal = attributesToUpdate['update'];

            for (let prop in tempVal) {
                modelObj[prop] = tempVal[prop];
            }
        }

        return modelObj.save(saveOptions, (err) => {
            return (err) ? err : modelObj;
        });
    }

    /**
     * Get all of the models from the data source.
     *
     * @param Object filters
     * @param bool|string|array populate
     * @return mixed
     */
    all(findCriteria = {}, populate = null) {
        if(populate) {
            findCriteria = this.processPopulate(findCriteria, populate);
        }

        return this.model.find(findCriteria);
    }

    /**
     * Get the paginated models from the data source.
     *
     * @param  Object filters
     * @return mixed
     */
    paginate(findCriteria = {}, perPage = null, populate = true, page = null, columns = ['*'], pageName = 'page') {
        let criteria = findCriteria;
        page = page || this.req.getParam('page', 1);
        const limit = perPage || App.helpers.getComputedPaginationLimit(this.req.getParam('limit'));

        if (populate) {
            criteria = this.processPopulate(findCriteria, populate);
        }

        return this.model.paginate(criteria, limit, page, columns, pageName)
            .then((result) => {
                const totalCount = App.helpers.getObjProp(result, 'count');
                const totalRows = App.helpers.getObjProp(result, 'rows');
                return this.getLengthAwarePaginatorInstance(totalRows, totalCount, limit, page).getJSON();
            });
    }

    /**
     * Get the paginated models from the data source.
     *
     * @param  Object filters
     * @return mixed
     */
    rawPaginate(query, perPage = null, page = null, columns = ['*'], pageName = 'page') {
        page = page || this.req.getParam('page', 1);
        const limit = perPage || App.helpers.getComputedPaginationLimit(this.req.getParam('limit'));
        const offset = (page * limit) - limit;

        return Promise.all([
            this.rawQuery(`SELECT COUNT(*) AS count FROM ( ${query} ) AS countTable`),
            this.rawQuery(`${query} LIMIT ${offset}, ${limit}`, 'model'),
        ])
        .then(([countResults, totalRows]) => {
            const totalCount = App.helpers.getObjProp(App.lodash.head(countResults), 'count');
            return this.getLengthAwarePaginatorInstance(totalRows, totalCount, limit, page).getJSON();
        });
    }

    /**
     * Runs a raw query
     *
     * @return mixed
     */
    rawQuery(query, queryType = null, custom = null) {
        let options = {};

        switch (queryType) {
            case 'model':
                options = { model: (custom) ? custom : this.model };
                break;

            case 'select':
                options = { type: sequelize.QueryTypes.SELECT };
                break;

            case 'custom':
                options = { type: custom };
                break;

            default:
                options = { type: sequelize.QueryTypes.SELECT };
                break;
        }

        return sequelize.query(query, options);
    }

    /**
     * Get LengthAwarePaginator's Instance with the current request object
     * 
     * @param {Array} modelObjects 
     * @param {number} total 
     * @param {number} limit 
     * @param {unmber} page 
     */
    getLengthAwarePaginatorInstance(modelObjects, total, limit = null, page = null) {
        const LengthAwarePaginator = require('../utilities/paginator/LenghtAwarePaginator');
        return new LengthAwarePaginator(this.req, modelObjects, total, page, limit);
    }

    /**
     * Get a model by its primary key.
     *
     * @param number      id
     * @param bool|string|array populate
     * @return mixed
     */
    get(id, populate = true) {
        let modelQuery = this.model.findById(id);

        if (populate) {

            let query = this.processPopulate({
                where: { id }
            }, populate);

            modelQuery = this.model.findOne(query);

        }

        return modelQuery
            .then(
                (record) => {
                    if (App.lodash.isUndefined(record) || !record) {
                        throw new ModelNotFoundError(`No record found!`);
                    }
                    return record;
                }
            );
    }

    /**
     * Get a model by specified column name & value.
     *
     * @param {number}            id
     * @param {bool|string|array} populate
     * 
     * @return mixed
     */
    getBy(columnValue, throwError = false, populate = true) {
        let modelQuery = this.model.findOne({
            where: columnValue,
        });

        if (populate) {
            let query = this.processPopulate({
                where: columnValue,
            }, populate);
            modelQuery = this.model.findOne(query);
        }

        return modelQuery.then(
            (record) => {
                if (record === undefined || App.lodash.isNull(record)) {
                    if (throwError) {
                        throw new ModelNotFoundError(`No record found`);
                    }
                }
                return record;
            }
        );
    }

    /**
     * Get a model by the specified criteria.
     *
     * @param {Object}            criteria
     * @param {bool|string|array} populate
     * @return mixed
     */
    getWhere(criteria, populate = true) {
        let modelQuery = this.model.findAll({ where: criteria });

        if (populate) {
            let query = this.processPopulate({ where: criteria }, populate);
            modelQuery = this.model.findAll(query);
        }

        return modelQuery.then(records => records);
    }

    /**
     * Save a new model and return the instance.
     *
     * @param Object attributes
     * @return mixed
     */
    create(attributes = {}) {
        return this.model.create(attributes);
    }

    /**
     * Save multiple new models and returns null.
     *
     * @param Array Objects
     * @return mixed
     */
    bulkCreate(attributesArray = []) {
        return this.model.bulkCreate(attributesArray);
    }

    /**
     * Save a new model and return the instance.
     *
     * @param Object attributes
     * @return mixed
     */
    findOrCreate(attributes = {}) {
        return this.model.findOrCreate(attributes)
            .spread((model, isCreated) => {
                return { model, isCreated };
            });
    }

    /**
     * Get the record(s) matching the attributes or create it.
     *
     * @param Object findCriteria
     * @param Object recordToCreate
     * @return mixed
     */
    findOrCreate(findCriteria, recordToCreate) {
        return this.model.findOrCreate(findCriteria, recordToCreate);
    }

    processPopulate(criteria = {}, populates = false) {
        if (populates === 'all') {
            return App.helpers.cloneObj(criteria, { include: [{ all: true }] });
        }

        let populateCriteria = { include: [] };

        if(App.helpers.isObject(populates) && populates.hasOwnProperty('include')) {
            populateCriteria = populates
        }

        if (populates) {
            let populateStr = this.req.getParam(App.helpers.config('settings.transformer.paramKey'));
            let populateArr = (App.lodash.isString(populateStr)) ? populateStr.split(',') : [];
            populateArr.map(
                (str) => {
                    if (!str.includes('.') && !App.lodash.isEmpty(str)) {
                        let obj = App.helpers.getObjProp(this.model.getIncludes(), str);

                        if (obj) {
                            // Check For Model Existence
                            let exisitingIncludeObj = false;
                            populateCriteria.include.some((includeObj) => {
                                if(includeObj.as == obj.as) {
                                    exisitingIncludeObj = true;
                                    return true;
                                }
                            });
                            if (! exisitingIncludeObj) {
                                populateCriteria.include.push(this.getEagerLoadedObj(obj));
                            }
                        }
                    }
                }
            );
        }

        return App.helpers.cloneObj(criteria, populateCriteria);
    }

    getEagerLoadedObj(obj) {
        if (obj) {
            return {
                model: Models[App.helpers.config(`models.${obj.model}`)],
                as: obj.as,
                // required: false,
                // distinct: true,
            }
        }
        return {};
    }

    /**
     * Delete the model from the data source.
     *
     * @param number id
     * @return mixed
     */
    delete(criteria, force = false) {
        if (force) {
            criteria = App.helpers.clonObj(criteria, { force });
        }

        return this.model.destroy(criteria)
            .then(modelObjects => modelObjects);
    }

    /**
     * Get the count from the matched passed criteria.
     *
     * @param Object criteria
     * @return mixed
     */
    count(criteria) {
        return this.model.count(criteria)
            .then(count => count);
    }

    /**
     * Get the max from the matched passed column and criteria.
     *
     * @param Object criteria
     * @return mixed
     */
    max(columnName, criteria = {}) {
        return this.model.max(columnName, criteria)
            .then(max => max);
    }

    /**
     * Get the min from the matched passed column and criteria.
     *
     * @param Object criteria
     * @return mixed
     */
    min(columnName, criteria = {}) {
        return this.model.min(columnName, criteria)
            .then(min => min);
    }

    /**
     * Get the sum from the matched passed column and criteria.
     *
     * @param Object criteria
     * @return mixed
     */
    sum(columnName, criteria = {}) {
        return this.model.sum(columnName, criteria)
            .then(sum => sum);
    }

    /**
     * Get unique slug for a model.
     *
     * @return string
     */
    async getUniqueSlug(value) {
        let slug = App.helpers.strSlug(value);

        // Look for total exisiting slugs count
        let slugCount = await this.model.findOne({
            attributes: [[sequelize.fn('COUNT', sequelize.col('slug')), 'slug_count']],
            where: {
                slug: {
                    [sequelize.Op.regexp]: `^${slug}(-[0-9]*)?$`,
                },
            },
        }).then(count => {
            return count.getData('slug_count');
        });

        if (slugCount == 0) {
            return slug;
        }

        // Look for exisiting slugs
        return this.model.findAll({
            attributes: ['slug'],
            limit: 1,
            where: {
                slug: {
                    [sequelize.Op.regexp]: `^${slug}(-[0-9]*)?$`,
                },
            },
            order: [['slug', 'DESC']],
        })
            .then((existingLatestSlug) => {
                let str = App.helpers.getTranslatedStr(existingLatestSlug[0].getData('slug'));
                let translatedStr = App.lodash.last(str.split('-'));

                let lastSlugNumber = App.helpers.intVal(translatedStr);
                slug += `-${lastSlugNumber + 1}`;
                return slug;
            });
    }

    /**
     * Get all records for a model.
     *
     * @return string
     */
    async findAll(criteria = {}) {
        return this.model.findAll(criteria);
    }

}

module.exports = BaseRepositoryContract;
