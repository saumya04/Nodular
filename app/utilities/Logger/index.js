const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

class Logger {

    constructor(options = {}) {
        if(App.helpers.getObjProp(options, 'format')) {
            options['format'] = this.getWinstonFormat(options.format);
        }

        this.options = options;

        this.setupLogFile();
        this.initLoggerInstance();
    }

    setupLogFile() {
        this.options.transports = [
            new winston.transports.File({ filename: App.helpers.getPathValue('storage.logs.error'), level: 'error' }),
            new winston.transports.File({ filename: App.helpers.getPathValue('storage.logs.combined') }),
        ];
        
        let filename = App.helpers.getObjProp(this.options, 'filename');
        if(filename) {
            switch(filename) {
                case 'fcm':
                    this.options.transports = [
                        new winston.transports.File({ filename: App.helpers.getPathValue('storage.logs.fcm') })
                    ];
                    break;
            }
        }
    }

    initLoggerInstance() {
        this.logger = winston.createLogger(App.helpers.cloneObj({
            level: 'info',
            format: this.getWinstonFormat(),
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log` 
                // - Write all logs error (and below) to `error.log`.
                //
                new winston.transports.File({ filename: App.helpers.getPathValue('storage.logs.error'), level: 'error' }),
                new winston.transports.File({ filename: App.helpers.getPathValue('storage.logs.combined') })
            ]
        }, this.options));

        console.log(App.helpers.getPathValue('storage.logs.error'), App.helpers.getPathValue('storage.logs.combined'))
    }

    getWinstonFormat(format = null) {
        switch(format) {
            case 'json':
                return winston.format.json();

            default:
                return combine(
                    label({ label: 'WinstonLogger' }),
                    timestamp(),
                    printf(info => {
                        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
                    })
                );
        }
    }

    log(format = null) {
        return this.logger.add(new winston.transports.Console({
            format: this.getWinstonFormat(format),
        }));
    }

    info(message) {
        return this.logger.log({
            level: 'info',
            message: message
        });
    }

    warn(message = null) {
        return this.logger.log({
            level: 'warn',
            message: message
        });
    }

    error(message = null) {
        return this.logger.log({
            level: 'error',
            message: message
        });
    }

}

module.exports = Logger;