const axios = require('axios');

class FCM {

    constructor() {
        this.credentials = {
            projectId: App.helpers.env('FIREBASE_PROJ_ID'),
            apiKey: App.helpers.env('FIREBASE_API_KEY'),
            serverKey: App.helpers.env('FIREBASE_SERVER_KEY'),
            messagingSenderId: App.helpers.env('FIREBASE_MESSAGING_SENDER_ID'),
        };
        this.initAxiosInstance();
    }

    initAxiosInstance() {
        this.axiosInstance = axios.create({
            baseURL: App.helpers.config('settings.firebase.fcm.url.base'),
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${App.helpers.getObjProp(this.credentials, 'serverKey')}`
            }
        });
    }

    send(params, registrationIds, options = null) {
        options = {
            priority: App.helpers.getObjProp(options, 'priority', 'high'),
            sound: App.helpers.getObjProp(options, 'sound', 'default'), // For notification sound
            click_action: App.helpers.getObjProp(options, 'click_action', 'FCM_PLUGIN_ACTIVITY'), // Must be present for Android
            icon: App.helpers.getObjProp(options, 'icon', 'fcm_push_icon') // White icon Android resource
        };

        let token = registrationIds;
        if (App.helpers.isArray(registrationIds)) {
            token = JSON.stringify(registrationIds);
        }

        let sendUrl = App.helpers.config('settings.firebase.fcm.url.send');
        let notificationPayload = {
            to: registrationIds
        };
        
        if(App.helpers.isArray(registrationIds)) {
            notificationPayload = {
                registration_ids: registrationIds,
                priority: App.helpers.getObjProp(options, 'priority'),
            }
        }
        
        notificationPayload = App.helpers.cloneObj(notificationPayload, {
            notification: {
                title: App.helpers.getObjProp(params, 'title'),
                body: App.helpers.getObjProp(params, 'body'),
                sound: App.helpers.getObjProp(options, 'sound'),
                click_action: App.helpers.getObjProp(options, 'click_action'),
                icon: App.helpers.getObjProp(options, 'icon'),
            },
            // to: token,
        });

        // Adding data param if exists
        if (App.helpers.getObjProp(params, 'data', false)) {
            notificationPayload = App.helpers.cloneObj(notificationPayload, {
                data: {
                    data: params.data
                }
            });
        }

        return this.axiosInstance.post(sendUrl, notificationPayload).then((res) => {
            // Logging fcm response
            let logMsgObj = {
                tokens: registrationIds,
                firebaseResponse: App.helpers.getObjProp(res, 'data'),
                notificationPayload: notificationPayload,
            }
            
            App.helpers.log(JSON.stringify(logMsgObj), 'info', {
                filename: 'fcm',
            });
        });
    }

}

module.exports = FCM;
