const AwsService = require('../../utilities/AWS/AwsService');
const UserService = require('../../services/UserService');
const GenericError = require('../../errors/GenericError')
const fs = require('fs');
const path = require('path');

module.exports = {

    // Serve user's profile photo from AWS
    showUserPhoto: async (req, res) => {
        
        let userSlug = req.params.userSlug;
        const photo = await new UserService(req).getUserProfilePhoto({
            slug: userSlug,
        });

        if (App.lodash.isEmpty(photo)) {
            let data = await fs.createReadStream(App.helpers.getPathValue('images.default.image'));
            return data.pipe(res);
        }

        const params = {
            Bucket: App.env.AWS_S3_BUCKET,
            Key: `${App.helpers.getPathValue('images.profile_pictures.default')}/${photo.name}`,
        };

        new AwsService().s3Instance.getObject(params, function(err, data) {
            console.log('data', data);
            res.writeHead(200, {
                'Content-Type': photo.mime_type
            });
            res.write(data.Body, 'binary');
            res.end(null, 'binary');
        });

    },

}