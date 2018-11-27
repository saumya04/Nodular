class CronJob {
    
    constructor() {
    }

    async init() {
        // Specify a task to run here...
        process.exit(0);
    }

}

new CronJob().init();

