const awsSdk = require('aws-sdk');

class AwsService {

    constructor(config = { aws: {}, s3: {} }) {
        this.credentials = {
            aws: App.helpers.cloneObj({
                signatureVersion: App.env.AWS_SIGNATURE_VERSION,
                // region: App.env.AWS_REGION,
            }, config.aws),
            s3: App.helpers.cloneObj({
                accessKeyId: App.env.AWS_ACCESS_KEY,
                secretAccessKey: App.env.AWS_SECRET_ACCESS_KEY,
            }, config.s3),
        };

        this.s3 = this.s3Instance;
    }

    get s3Instance() {
        // let s3 = new awsSdk.S3(this.credentials.aws);
        let s3 = new awsSdk.S3(this.credentials.aws);
        awsSdk.config.update(this.credentials.s3);
        return s3;
    }

    getSignedUrl(operation = 'getObject', params, callback) {
        return this.s3.getSignedUrl(operation, params, callback);
    }

    uploadFileToS3(filename, file, bucket) {

        console.log('\n\n\n\nUploading file to s3 from AWS service\n\n\n\n', filename, file, bucket, '\n\n\n\n');

        const buffer = App.helpers.getObjProp(file, 'buffer');
        const base64data = new Buffer(buffer, 'binary');
        const params = {
            Body: base64data,
            Key: filename,
            Bucket: bucket
        }

        return new Promise((resolve, reject) => {
            this.s3.putObject(params, (err, data) => {
                if (err) {
                    console.log(App.chalk.red('Error ----------------> '), err, err.stack);
                    reject(err);
                }
                else {
                    console.log(App.helpers.showMessage('File uploaded successfully'));
                    resolve(true);
                }
            })
        });
    }

    uploadProfilePhoto(file, customFilename = null) {
        const filename = (customFilename) ? customFilename : App.helpers.getPreparedFilenameForS3('image');
        const fullBucketPath = App.helpers.getBucketPath('profile_photo');
        const uploadFileToS3Promise = this.uploadFileToS3(filename, file, fullBucketPath);
        return {
            filename,
            uploadFileToS3Promise
        }
    }

    uploadDraft(file, customFilename = null) {
        const filename = (customFilename) ? customFilename : App.helpers.getPreparedFilenameForS3('draft');
        const fullBucketPath = App.helpers.getBucketPath('draft');
        const uploadFileToS3Promise = this.uploadFileToS3(filename, file, fullBucketPath);
        return {
            filename,
            uploadFileToS3Promise
        }
    }

}

module.exports = AwsService;