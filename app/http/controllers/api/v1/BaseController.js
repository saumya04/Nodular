class BaseController {

    static async getTransformedData(req, data, transformer, transformOptions = null) {
        if(App.lodash.isEmpty(data)) {
            if(App.lodash.isNull(data) || App.lodash.isArray(data))
                return data;
            return {};
        }

        if(App.lodash.isArray(data)) {
            let returnArr = data.map((result) => {
                return (new transformer(req, result, transformOptions)).init();
            });
            return await Promise.all(returnArr);
        }
        return (new transformer(req, data, transformOptions)).init();
    }

    static getTransformedDataWithMeta(req, obj, transformer, transformOptions = null) {
        const data = this.getTransformedData(req, obj.data, transformer, transformOptions);
        const meta = App.helpers.objectExcept(data, ['data']);

        return Promise.all(data)
            .then(data => {
                return { data, meta };
            });
    }

    static getTransformedDataWithPagination(req, obj, transformer, transformOptions) {
        const data = obj.data.map(record => this.getTransformedData(req, record, transformer, transformOptions));
        const pagination = App.helpers.objectExcept(obj, ['data']);

        return Promise.all(data)
            .then(data => {
                return { data, meta: { pagination } };
            });
    }

    static getTransformedDataWithPaginationMeta(req, obj, transformer, transformOptions) {
        const data = obj.paginatedData.data.map(record => this.getTransformedData(req, record, transformer, transformOptions));
        const pagination = App.helpers.objectExcept(obj.paginatedData, ['data']);

        return Promise.all(data)
            .then(data => {
                return { data, meta: App.helpers.cloneObj(obj.meta, { pagination }) };
            });
    }

}

module.exports = BaseController;
