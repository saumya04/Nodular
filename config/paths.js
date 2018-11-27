module.exports = {

    documents: {
        drafts: {
            default: `uploads/documents/drafts`,
        },
        conversations: {
            default: `uploads/documents/chat`,
        },
    },

    images: {
        profile_pictures: {
            default: `uploads/images/profile_pictures`
        },
        default: {
            image: `${App.paths.root}/public/images/sample_img.jpg`,
        },
    },

    storage: {
        temp: {
            imports: `${App.paths.storage}/imports`,
        },
        logs: {
            error: `${App.paths.storage}/logs/error.log`,
            combined: `${App.paths.storage}/logs/combined.log`,
            fcm: `${App.paths.storage}/logs/fcm.log`,
        },
    },
    
    misc: {
        appLogo: {
            default: `${App.env.ADMIN_APP_URL}/assets/images/logo.png`,
        }
    },

};