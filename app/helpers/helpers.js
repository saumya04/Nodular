const sizeOf = require('image-size');
const strtr = require('locutus/php/strings/strtr');
const intval = require('locutus/php/var/intval')
const trim = require('locutus/php/strings/trim');
const GenericError = require('../errors/GenericError');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const fs = require('fs');
const path = require('path');

class Helper {

    static isEmpty(value) {
        let bool = value == null ||
            (typeof value === 'string' && value.length === 0) ||
            (Helper.isArray(value) && value.length === 0);

        if (typeof value === 'object') {
            for (let key in value) {
                if (value.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        return bool;
    }

    static getQueryParamsString(paramsObj = {}) {
        let parts = [];
        for (var i in paramsObj) {
            if (paramsObj.hasOwnProperty(i)) {
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(paramsObj[i]));
            }
        }
        return '?' + parts.join("&");
    }

    static isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }

    static isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    static isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    static isObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    static cloneObj(obj, ...sources) {
        return App.lodash.assign({}, obj, ...sources);
    }

    static getObjProp(obj, dotNotationStr, defaultVal = null) {
        return App.lodash.get(obj, dotNotationStr, defaultVal);
        // let value = App.lodash.property(dotNotationStr)(obj);
        // console.log('value', dotNotationStr, value)
        // return (App.lodash.isUndefined(value)) ? defaultVal : value;
    }

    static config(dotNotationStr = '', defaultVal = null) {
        const config = require('../../config');
        return this.getObjProp(config, dotNotationStr, defaultVal);
    }

    static formatDate(date, format = 'Do MMM, YYYY (hh:mm A)') {
        return App.moment(date).format(format);
    }

    /**
     * Get default pagination limit
     * 
     * {number} key [key to pick]
     */
    static getDefaultPaginationLimit(key = 'default') {
        return this.config('settings.pagination.limit')[key];
    }

    /**
     * Get computed pagination limit on the basis of passed limit
     * 
     * @return {number} limit for pagination
     */
    static getComputedPaginationLimit(limit = null) {
        limit = limit || this.getDefaultPaginationLimit();

        if (limit > this.config('settings.pagination.limit.max')) {
            limit = this.config('settings.pagination.limit.max');
        }

        return parseInt(limit);
    }

    /**
     * 
     * @param {any} needle 
     */
    static contains(arr, needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;

        if (!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function (needle) {
                var i = -1, index = -1;

                for (i = 0; i < arr.length; i++) {
                    var item = arr[i];

                    if ((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(arr, needle) > -1;
    }

    /**
   * [getMimeType description]
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */
    static getMimeType(path) {
        if (!Buffer.isBuffer(path)) {
            const buffer = readChunk.sync(path, 0, 4100);
            return fileType(buffer);
        }
        return fileType(path);
    }

    /**
     * [getDimension description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    static getDimension(path) {
        return new Promise((resolve, reject) => {
            return sizeOf(path, (err, dimensions) => {
                if (err) return reject(err);
                return resolve(dimensions);
            });
        });
    }

    /**
     * Get Translated String for the provided one
     * @param {string}  string
     * @param {array}   attributes
     */
    static getTranslatedStr(string, attributes = {}) {
        if (App.lodash.isString(string)) {
            return strtr(string, attributes);
        }
        return string;
    }

    static intVal(mixedVar, base) {
        return (base) ? intval(mixedVar, base) : intval(mixedVar);
    }

    static strSlug(str) {
        let slug = str.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        return this.trimStr(slug);
    }

    static trimStr(str, char = null) {
        return (char) ? trim(str, char) : trim(str);
    }

    static getDataValues(data) {
        return this.getObjProp(data, 'dataValues');
    }

    /**
     * Return the string with ['_', ' '] converted to camel case
     * @param  {[String]} string
     * @return {[String]}
     */
    static toCamelCase(string) {
        const [first, ...rest] = string.replace(/[^\w]/g, ' ').split(/[-_\s+]/).filter(Boolean);
        return first.toLowerCase() + rest.map(char => char.charAt(0).toUpperCase() + char.slice(1).toLowerCase()).join('');
    }

    /**
     * Return an object with the keys specified
     *
     * @param  Object         obj
     * @param  array | string keys
     * @return Object
     */
    static objectOnly(obj, keys) {
        let target = {};
        for (var i in obj) {

            if (keys.indexOf(i) < 0)
                continue;

            if (!Object.prototype.hasOwnProperty.call(obj, i))
                continue;

            target[i] = obj[i];
        }

        return target;
    }

    /**
     * Return an object without the keys specified
     *
     * @param  Object         obj
     * @param  array | string keys
     * @return Object
     */
    static objectExcept(obj, keys) {
        let target = {};
        for (var i in obj) {
            if (keys.indexOf(i) >= 0)
                continue;

            if (!Object.prototype.hasOwnProperty.call(obj, i))
                continue;

            target[i] = obj[i];
        }

        return target;
    }

    static getUniqueId(prefix = '', postfix = '', radix = 36) {
        let uniqId = Math.random().toString(radix).substr(2, 9);
        return `${prefix}${uniqId}${postfix}`;
    }

    static getPathValue(key = '') {
        return this.config(`paths.${key}`);
    }

    static getMessageValue(key = '') {
        return this.config(`messages.${key}`);
    }

    static spaceLog(...args) {

        console.log('\n\n\n');
        args.forEach(element => console.log(element));
        console.log('\n\n\n');
    }

    static getToken(req, res, key = null) {
        const authHeader = this.getObjProp(req, 'headers.authorization');
        if (!authHeader) {
            return res.error(new GenericError("No Auth Token found"), 400);
        }
        const token = authHeader.split(' ')[1];
        return (key) ? this.getObjProp(token, key) : token;
    }

    static async bcryptPassword(password) {
        const bcrypt = require('bcrypt');
        return await bcrypt.hash(password, this.config('settings.bcrypt.saltRounds'));
    }

    static getUuid() {
        return require('uuid/v4')();
    }

    static showMessage(message1, message2 = "") {
        console.log(App.chalk.green('\n\n####################################\n\n'), message1, message2, App.chalk.green('\n\n####################################\n\n'));
    }

    static logMessage(message1, message2 = "") {
        console.log(App.chalk.cyan('\n\n####################################\n\n'), message1, message2, App.chalk.cyan('\n\n####################################\n\n'));
    }

    static notify(message, data = "") {
        console.log(App.chalk.yellow('\n\n', message), '\n', data, '\n\n');
    }

    static getEncryptedStr(id, delimeter = '|') {
        let dataArr = [
            id,
            this.getRandomInt(999999),
            App.moment().format('x'),
        ];

        const aes256 = require("aes256");
        const cipher = aes256.createCipher(App.env.APP_KEY);
        return cipher.encrypt(dataArr.join(delimeter));
    }

    static getDecryptedData(tokenStr, delimeter = '|') {
        const aes256 = require("aes256");
        const cipher = aes256.createCipher(App.env.APP_KEY);
        let decryptedStr = null;
        try {
            decryptedStr = cipher.decrypt(tokenStr);
        } catch (e) {
            throw new GenericError("Invalid token passed!");
        }
        const dataArr = decryptedStr.split(delimeter);
        return {
            id: this.getObjProp(dataArr, '0'),
            randomNumber: this.getObjProp(dataArr, '1'),
            timestamp: this.getObjProp(dataArr, '2'),
        };
    }

    static getRandomInt(max = 9999) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static getPreparedFilenameForS3(type) {

        const timestamp = new Date().getTime();
        const randomNumber = this.getRandomInt();

        switch (type) {

            case 'image':
                return `${timestamp}${randomNumber}-img`;

            case 'draft':
                return `${timestamp}${randomNumber}-draft`;
        }

    }

    static getBucketPath(type) {

        let basePath = `${App.paths.s3.bucket}`;

        switch (type) {

            case 'profile_photo':
                return `${basePath}/${App.helpers.getPathValue('images.profile_pictures.default')}`;

            case 'draft':
                return `${basePath}/${App.helpers.getPathValue('documents.drafts.default')}`;

        }
    }

    static env(dotNotationStr = '', defaultVal = null) {
        return this.getObjProp(App.env, dotNotationStr, defaultVal);
    }

    static async saveFile(filename, content) {
        return new Promise((resolve, reject) => {
            fs.appendFile(filename, content, 'utf-8', (err, file) => {
                if (err)
                    reject(err);
                else
                    resolve(file);
            });
        });
    }

    static async removeFile(filePath, sync = true) {
        if (sync) {
            return await fs.unlinkSync(path.resolve(filePath));
        }
        return fs.unlink(path.resolve(filePath));
    }

    static formatTimestamp(timestamp) {
        let date, time;
        [date, time] = timestamp.split(', ');
        time = time.substring(0, time.lastIndexOf(':'));
        time = this.convertTimeTo24Hr(time);
        return `${date} ${time}`;
    }

    static getAdminEmails(type = 'all', delimeter = ',') {
        let email = '';

        switch (type) {
            case 'all':
                email = App.env.ADMIN_EMAILS;
                break;
        }

        return email.split(delimeter);
    }

    static log(message = null, level = 'info', options = {}) {
        const Logger = require('../utilities/Logger');
        let loggerObj = new Logger(options);
        switch (level) {
            case 'warn':
                return loggerObj.log().warn(message);

            case 'error':
                return loggerObj.log().error(message);

            default:
                return loggerObj.log().info(message);
        }
    }

    static getAuthUser(req) {
        return this.getObjProp(req, 'auth.user', null);
    }

    static addMetaDataToReq(req, data) {
        if(req.hasOwnProperty('meta')) {
            req['meta'] = this.cloneObj(req.meta, data);
        } else {
            req['meta'] = data;
        }

        return req;
    }

    static getReqMetaData(req, key = null, defaultVal = {}) {
        let metaKey = 'meta';
        
        let finalKey = metaKey;
        if(key) {
            finalKey = `${metaKey}.${key}`;
        }

        return this.getObjProp(req, finalKey, defaultVal);
    }

}

module.exports = Helper;