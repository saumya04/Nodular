var ValidatorJS = require('validatorjs');
var ValidationError = require('../errors/ValidationError');

/**
 * Validator Base Class
 */
class Validator {

    constructor() {
        if (this.constructor === Validator) {
            throw new TypeError('Abstract class "Validator" cannot be instantiated directly.');
        }

        if (this.getRules === undefined) {
            throw new TypeError('"getRules" widget abstract class');
        }
    }

    /**
     * Get rules according to the passed type & meta_data
     *
     * @param  string type
     * @param  array  meta_data
     * @return Object
     */
    getRules(type, meta_data = {}) { }

    /**
     * Get custom messages
     *
     * @param  string type
     * @return Object
     */
    getMessages(type) {
        return {};
    }

    /**
     * Get custom attribute names
     *
     * @param  string type
     * @return Object
     */
    getAttributeNamesForHuman(type) {
        return {};
    }

    /**
     * Validate Data
     *
     * @param  array    inputs
     * @param  string   type
     * @param  Object   meta_data
     * @return boolean
     */
    validate(inputs, type, meta_data = {}) {

        var validator = new ValidatorJS(
            inputs,
            this.getRules(type, meta_data),
            this.getMessages(type)
        );

        validator.setAttributeNames(this.getAttributeNamesForHuman(type));

        return new Promise((resolve, reject) => {
            return validator.checkAsync(
                () => resolve(inputs),
                () => reject(new ValidationError(validator.errors.all()))
            );
        });

    }


}

module.exports = Validator;
