const csvtojson = require("csvtojson");
const ImportError = require('../../errors/ImportError')

class BaseImporter {

    constructor(req, file, options = {}) {
        this.VALIDATION_LIMIT = 100;
        this.csvToJson = csvtojson;
        this.file = file;
        this.fileData = [];
        this.req = req;
        this.errors = [];
        this.options = App.helpers.cloneObj({
            deleteFileOnComplete: true,
        }, options);
    }

    async handleReader() {
        await this.processDataFromFile();
        await this.validateReader();
        this.showErrorMessages();

        if (this.passes()) {
            let promiseArr = this.fileData.map((inputs, key) => {
                return this.runTask(inputs);
            });
            await Promise.all(promiseArr);
        }

        if(App.helpers.getObjProp(this.options, 'deleteFileOnComplete', false)) {
            this.deleteFileFromPath();
        }
        return this;
    }

    async deleteFileFromPath() {
        return await App.helpers.removeFile(this.file.path);
    }

    async validateReader() {
        let promises = this.fileData.map(async (inputs, key) => {
            if (this.validationHitsTheLimit()) {
                return false;
            }

            let error = await this.validate(inputs, key);
            if (error) {
                this.errors[key] = error;
            }
        });
        await Promise.all(promises);
    }

    get csvToJsonInstance() {
        return this.csvToJson;
    }

    async processDataFromFile() {
        if(! App.helpers.getObjProp(this.file, 'path', false)) {
            throw new ImportError("Invalid file passed!");
        }

        this.fileData = await this.csvToJsonInstance().fromFile(this.file.path);
        // TODO: Sanitize each rows
    }

    validationHitsTheLimit() {
        return this.errors.length >= this.VALIDATION_LIMIT;
    }

    passes() {
        return this.errors.length === 0;
    }

    fails() {
        return ! this.passes();
    }

    showErrorMessages() {
        console.log("Inside - ", this.errors.length);
        if(this.fails()) {
            console.log("Number of rows succeeded to import - ");
            console.log("Number of rows failed to import - ");
            let rowNoArr = [];

            this.errors.map((err, key) => {
                rowNoArr.push(key + 1);
                App.lodash.forEach(err, (e) => {
                    // console.log(`========================`);
                    // console.log(`Row Number - ${key + 1}`);
                    // console.log(App.lodash.head(e));
                    // console.log(`========================`);
                });
            });
            
            let msg = `There are total ${this.errors.length} errors in the file. Rows having issues: ${rowNoArr.join(',')}`;
            this.deleteFileFromPath();
            throw new ImportError(msg);
        }
    }

}

module.exports = BaseImporter;