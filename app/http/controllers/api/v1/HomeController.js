module.exports = {

    /**
     * GET /config
     * Config API.
     */
    config: async (req, res, next) => {
        let configDetails = {
            public: {
                samples: App.helpers.config('paths.samples'),
            },
        };
        return res.success(configDetails);
    },

}