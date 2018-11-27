const multer = require('multer');

class FormData {

    constructor(req) {
        this.req = req;
    }

    async getUserFormData(fieldname, options = {}) {

        console.log(App.chalk.blue('getUserFormData called with'), fieldname);
        const upload = multer().single(fieldname);

        return await new Promise((resolve, reject) => {
            
            upload(this.req, this.res, (err) => {
                if (err) {
                    console.log(App.chalk.red('Error in getting file from the request'), err);
                    reject(null);
                }

                // const file = this.req.file;
                console.log(App.chalk.blue('\n\n File Object', '\n\n'), this.req.file, '\n\n', this.req.body, '\n\n');
                resolve(this.req);
            });
        });

        
        
        // console.log('\n\n', 'Media', '\n\n', media, '\n\n');

        // Media object looks like this
        // {
        //     fieldname: 'profile_photo',
        //     originalname: 'Screen Shot 2018-09-07 at 12.53.39 PM.png',
        //     encoding: '7bit',
        //     mimetype: 'image/png',
        //     buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 05 a0 00 00 03 84 08 06 00 00 00 57 4d 96 d2 00 00 18 32 69 43 43 50 49 43 43 20 50 72 6f 66 69 ... >,
        //                         size: 356179
        // }

        // const filename = App.helpers.getPreparedFilenameForS3(media.originalname);
        // const bucketName = App.helpers.config('settings.aws.s3.bucket.profile_pictures');

        // return new AwsService(this.req, this.res).uploadFileToS3(filename, media.buffer, bucketName);

    }

    async getFormDataWithOptions(fieldname, options = {}) {
        options = App.helpers.cloneObj({
            dest: App.helpers.config('paths.storage.temp.imports'),
        }, options);
        
        const upload = multer(options).single(fieldname);

        return await new Promise((resolve, reject) => {
            upload(this.req, this.res, (err) => {
                if (err) {
                    console.log(App.chalk.red('Error in getting file from the request'), err);
                    reject(null);
                }

                console.log(App.chalk.blue('\n\n File Object', '\n\n'), this.req.file, '\n\n', this.req.body, '\n\n');
                resolve(this.req);
            });
        });
    }
}

module.exports = FormData;