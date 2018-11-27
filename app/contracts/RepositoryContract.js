class RepositoryContract {

    constructor() {
        if (this.constructor === RepositoryContract) {
            throw new TypeError('Abstract class "RepositoryContract" cannot be instantiated directly.');
        }
    }

    /**
     * Get all of the models from the data source.
     *
     * @param Object      filters
     * @param bool|string populate
     * @return mixed
     */
    all(filters = {}, populate = null) { }

    /**
     * Get the paginated models from the data source.
     *
     * @param  Object filters
     * @return mixed
     */
    paginate(filters = {}) { }

    /**
     * Get a model by its primary key.
     *
     * @param number      id
     * @param bool|string populate
     * @return mixed
     */
    get(id, populate = null) { }

    /**
     * Get a model by specified column name & value.
     *
     * @param number      id
     * @param bool|string populate
     * @return mixed
     */
    getBy(column_value, populate = null) { }

    /**
     * Save a new model and return the instance.
     *
     * @param Object attributes
     * @return mixed
     */
    create(attributes) { }

    /**
     * Get the record(s) matching the attributes or create it.
     *
     * @param Object findCriteria
     * @param Object recordToCreate
     * @return mixed
     */
    findOrCreate(findCriteria, recordToCreate) { }

    /**
     * Update the model by the given attributes.
     *
     * @param Object findCriteria
     * @param Object attributesToUpdate
     * @return mixed
     */
    update(findCriteria, attributesToUpdate) { }

    /**
     * Save model attributes.
     *
     * @param Object findCriteria
     * @param Object attributesToUpdate
     * @return mixed
     */
    save(modelObj, attributesToUpdate, populate = false) { }

    /**
     * Delete the model from the data source.
     *
     * @param number id
     * @return mixed
     */
    delete(criteria) { }

}

module.exports = RepositoryContract;
