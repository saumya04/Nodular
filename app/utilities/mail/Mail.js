const nodemailer = require('nodemailer');

class Mail {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: App.env.MAIL_HOST || null,
            port: App.env.MAIL_PORT || null,
            secure: (App.env.MAIL_PORT === '465') ? true : false,
            auth: {
                user: App.env.MAIL_USERNAME || null,
                pass: App.env.MAIL_PASSWORD || null,
            }
        });
    }

    /**
     *
     * Sends email(s)
     * @param options = {
     *  to : string/Array, <required>
     *  from : string in format "Jimmy Fallon <jimmyfallon@gmail.com>" <optional>
     *  subject : string, <required>
     *  html : string, <required>
     * }
     */
    send(options) {
        let required = ['to', 'subject', 'html'];

        required.forEach(field => {
            if (App.helpers.isEmpty(options[field])) {
                throw new ReferenceError(`"${field}" not found`);
            }
        });

        if (App.helpers.isArray(options.to)) {
            options.to = options.to.join(',');
        }

        if (App.helpers.isArray(options.bcc)) {
            options.bcc = options.bcc.join(',');
        }

        if (App.helpers.isEmpty(options.from)) {

            if (App.helpers.isEmpty(App.env.MAIL_DEFAULT_SENDER_NAME) && App.helpers.isEmpty(App.env.MAIL_DEFAULT_SENDER_EMAIL)) {
                throw new ReferenceError('"from" is not defined in environment or given in options')
            }

            options.from = `${App.env.MAIL_DEFAULT_SENDER_NAME} <${App.env.MAIL_DEFAULT_SENDER_EMAIL}>`;
        }

        return this.transporter.sendMail(options)
            .then(data => {
                Mail.log(options.to, data);
                return data;
            })
            .catch(error => {
                return error;
            });
    }

    /**
     *
     * Shoots email(s) to admin
     * @param options = {
     *  subject : string, <required>
     *  html : string, <required>
     *  from : string in format "Jimmy Fallon <jimmyfallon@gmail.com>" <optional>
     * }
     */
    sendToAdmins(options) {
        options.to = App.env.ADMIN_EMAILS && App.env.ADMIN_EMAILS.split(',');
        return this.send(options);
    }

    static log(emails, response) {
        console.log('Email Response: ', {
            to: emails,
            error: response instanceof Error ? true : false,
            results: response instanceof Error ? {
                message: response.message,
                response: JSON.stringify(response)
            } : {
                    messageId: response.messageId,
                    response: response.response
                }
        });
    }


}

module.exports = Mail;