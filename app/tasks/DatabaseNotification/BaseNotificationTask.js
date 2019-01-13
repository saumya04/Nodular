class BaseNotificationTask {

    constructor(req, data) {
        this.req = req;
        this.data = data;
    }

    async getTransformedData(req, data, transformer, transformOptions = { excludeIncludes: true }) {
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

    // Method responsible to get back the data for certain type of notificaiton
    async getData() {}

}

module.exports = BaseNotificationTask;

/**
 * let notif = new SomeNotification(req, data);
 * notif.getData(); -----> gives data from certain notification
 */