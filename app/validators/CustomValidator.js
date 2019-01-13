var ValidatorJS = require("validatorjs");
const moment = App.moment;
const _ = App.lodash;
const Models = require("../models");
const Op = require("sequelize").Op;

class CustomValidator {
    static init(ruleName, methodName, async = false) {
        if (async) {
            ValidatorJS.registerAsync(
                ruleName,
                CustomValidator[methodName],
                CustomValidator.messages[ruleName] || null
            );
        } else {
            ValidatorJS.register(
                ruleName,
                CustomValidator[methodName],
                CustomValidator.messages[ruleName] || null
            );
        }
    }

    /**
     * Unique Validation Rule
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @param  Object passes
     * @return void
     */
    static validateUnique(value, requirement, attribute, passes) {
        const { isEmpty } = App.helpers;

        const [model, column, ...except] = requirement.split(",");
        except.join(",");

        const key = isEmpty(column) ? attribute : column;

        Models[model]
            .findOne({
                where: {
                    [`${key}`]: value
                }
            })
            .then(obj => {
                if (isEmpty(obj)) {
                    return passes();
                } else {
                    if (
                        !isEmpty(except) &&
                        _.indexOf(except, _.property(key)(obj)) > -1
                    ) {
                        return passes();
                    }
                    return passes(false);
                }
            })
            .catch(err => passes(false));
    }

    /**
     * IsExist Validation Rule
     * @param  {[type]} value       [description]
     * @param  {[type]} requirement [description]
     * @param  {[type]} attribute   [description]
     * @param  {[type]} passes      [description]
     * @return {[type]}             [description]
     */
    static validateIsExist(value, requirement, attribute, passes) {
        const { isEmpty } = App.helpers;
        const [model, column] = requirement.split(",");
        const key = isEmpty(column) ? attribute : column;

        Models[model]
            .findOne({
                where: {
                    [`${key}`]: value
                }
            })
            .then(obj => {
                return isEmpty(obj) ? passes(false) : passes();
            })
            .catch(err => passes(false));
    }

    /**
     * NotExist Validation Rule
     *
     * @param  {[type]} value       [description]
     * @param  {[type]} requirement [description]
     * @param  {[type]} attribute   [description]
     * @param  {[type]} passes      [description]
     * @return {[type]}             [description]
     */
    static validateNotExist(value, requirement, attribute, passes) {
        const { isEmpty } = App.helpers;
        const [
            model,
            column,
            matchingColumn,
            matchingColumnVal
        ] = requirement.split(",");

        Models[model]
            .findOne({
                where: {
                    [`${column}`]: value,
                    [`${matchingColumn}`]: matchingColumnVal
                }
            })
            .then(obj => {
                if (isEmpty(obj)) {
                    return passes();
                }
                let customMsg = `The ${column} is already been associated with ${matchingColumn}.`.replace(
                    /_id/g,
                    ""
                );
                return passes(false, App.helpers.toSentenceCase(customMsg));
            })
            .catch(err => passes(false));
    }

    /**
     * [validateMimetypes description]
     * @param  {[type]} value       [description]
     * @param  {[type]} requirement [description]
     * @param  {[type]} attribute   [description]
     * @return {[type]}             [description]
     */
    static validateMimetypes(value, requirement = "", attribute) {
        console.log(
            App.chalk.inverse.red("Validating mime type "),
            value,
            requirement
        );
        const allowed = requirement.split(",").filter(Boolean);
        const filetype = App.helpers.getMimeType(value.buffer);
        if (!filetype) {
            return false;
        }
        const { ext, mime } = filetype;
        return allowed.indexOf(mime) === -1 ? false : true;
    }

    static uploadedFileMimeType(value, requirement, attribute) {
        console.log(
            App.chalk.inverse.red("Validating mime type "),
            value,
            requirement
        );
        const allowed = requirement.split(",").filter(Boolean);
        const mimeType = App.helpers.getObjProp(value, "mimetype");
        console.log("Allowed ", allowed, "mimeType found", mimeType);
        return allowed.indexOf(mimeType) === -1 ? false : true;
    }

    /**
     * [validateImageSize description]
     * @param  {[type]} value       [description]
     * @param  {[type]} requirement [description]
     * @param  {[type]} attribute   [description]
     * @return {[type]}             [description]
     */
    static validateImageSize(value, requirement, attribute) {
        return value.size > requirement ? false : true;
    }

    /**
     * [validateFileSize description]
     * @param  {[type]} value       [description]
     * @param  {[type]} requirement [description]
     * @param  {[type]} attribute   [description]
     * @return {[type]}             [description]
     */
    static validateFileSize(value, requirement, attribute) {
        return value.size > requirement ? false : true;
    }

    /**
     * [validateImageDimension description]
     * @param  {[type]} value       [description]
     * @param  {[type]} requirement [description]
     * @param  {[type]} attribute   [description]
     * @param  {[type]} passes      [description]
     * @return {[type]}             [description]
     */
    static validateImageDimension(value, requirement, attribute, passes) {
        let min_width = false,
            min_height = false,
            max_width = false,
            max_height = false,
            width = false,
            height = false,
            ratio = false;

        requirement
            .split(",")
            .filter(Boolean)
            .forEach(condition => {
                if (condition.match(/^min_width=/)) {
                    min_width = condition.split("=").pop();
                }
                if (condition.match(/^min_height=/)) {
                    min_height = condition.split("=").pop();
                } else if (condition.match(/^max_width=/)) {
                    max_width = condition.split("=").pop();
                } else if (condition.match(/^max_height=/)) {
                    max_height = condition.split("=").pop();
                }
                if (condition.match(/^width=/)) {
                    width = condition.split("=").pop();
                } else if (condition.match(/^height=/)) {
                    height = condition.split("=").pop();
                } else if (condition.match(/^ratio=/)) {
                    ratio = condition.split("=").pop();
                }
            });

        let dimensions = App.helpers
            .getDimension(value.path)
            .then(dimension => {
                const _width = dimension.width;
                const _height = dimension.height;
                if (min_width && parseInt(_width) < parseInt(min_width)) {
                    return false;
                }
                if (min_height && parseInt(_height) < parseInt(min_height)) {
                    return false;
                }
                if (max_width && parseInt(_width) < parseInt(max_width)) {
                    return false;
                }
                if (max_height && parseInt(_height) < parseInt(max_height)) {
                    return false;
                }
                if (width && parseInt(_width) < parseInt(width)) {
                    return false;
                }
                if (height && parseInt(_height) < parseInt(height)) {
                    return false;
                }
                if (
                    ratio &&
                    parseFloat(_width / _height) != parseFloat(ratio)
                ) {
                    return false;
                }
                return true;
            });

        return Promise.all([dimensions])
            .then(data => !!data.every(o => o === true))
            .then(status => passes(status));
    }

    static checkForImageSize(file) {
        return App.helpers.getDimension(file.path).then(dimension => {
            const _width = dimension.width;
            const _height = dimension.height;
            if (min_width && parseInt(_width) < parseInt(min_width)) {
                return false;
            }
            if (min_height && parseInt(_height) < parseInt(min_height)) {
                return false;
            }
            if (max_width && parseInt(_width) < parseInt(max_width)) {
                return false;
            }
            if (max_height && parseInt(_height) < parseInt(max_height)) {
                return false;
            }
            if (width && parseInt(_width) < parseInt(width)) {
                return false;
            }
            if (height && parseInt(_height) < parseInt(height)) {
                return false;
            }
            if (ratio && parseFloat(_width / _height) != parseFloat(ratio)) {
                return false;
            }
            return true;
        });
    }

    /**
     * Check if provided value is greater than given value
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @return void
     */
    static validateGreaterThan(value, requirement, attribute) {
        let allParams = sails.req.allParams();
        if (!allParams.hasOwnProperty(requirement)) {
            return false;
        }
        if (parseFloat(value) > parseFloat(allParams[requirement])) {
            return true;
        }
        return false;
    }

    /**
     * Check if provided value is greater than or equal to the given value
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @return void
     */
    static validateGreaterThanEqual(value, requirement, attribute) {
        let allParams = sails.req.allParams();
        if (!allParams.hasOwnProperty(requirement)) {
            return false;
        }
        if (parseFloat(value) >= parseFloat(allParams[requirement])) {
            return true;
        }
        return false;
    }

    /**
     * Check if provided value is less than the given value
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @return void
     */
    static validateLessThan(value, requirement, attribute) {
        let allParams = sails.req.allParams();
        if (!allParams.hasOwnProperty(requirement)) {
            return false;
        }
        if (parseFloat(value) < parseFloat(allParams[requirement])) {
            return true;
        }
        return false;
    }

    /**
     * Check if provided value is less than or equal the given value
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @return void
     */
    static validateLessThanEqual(value, requirement, attribute) {
        let allParams = sails.req.allParams();
        if (!allParams.hasOwnProperty(requirement)) {
            return false;
        }
        if (parseFloat(value) <= parseFloat(allParams[requirement])) {
            return true;
        }
        return false;
    }

    /**
     * Check if the provided value is a valid youtube URL
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @return void
     */
    static validateYoutubeUrl(value, requirement, attribute) {
        return App.helpers.validateYoutubeUrl(value) ? true : false;
    }

    /**
     * Check if the provided value is a valid datetime
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @return void
     */
    static validateDateTime(value, requirement, attribute) {
        let requirementArr = requirement.split(",");
        let requirementObj = {};
        requirementArr.forEach(val => {
            let arr = val.split("=");
            requirementObj[arr[0]] = arr[1];
        });

        let boolArr = [];

        for (let rule in requirementObj) {
            switch (rule) {
                case "format":
                    boolArr.push(
                        moment(value, requirementObj[rule], true).isValid()
                    );
                    break;

                case "after":
                    boolArr.push(
                        moment(value, requirementObj["format"], true).isAfter(
                            requirementObj[rule]
                        )
                    );
                    break;

                case "sameOrAfter":
                    boolArr.push(
                        moment(
                            value,
                            requirementObj["format"],
                            true
                        ).isSameOrAfter(requirementObj[rule])
                    );
                    break;

                case "before":
                    boolArr.push(
                        moment(value, requirementObj["format"], true).isBefore(
                            requirementObj[rule]
                        )
                    );
                    break;

                case "sameOrBefore":
                    boolArr.push(
                        moment(
                            value,
                            requirementObj["format"],
                            true
                        ).isSameOrBefore(requirementObj[rule])
                    );
                    break;

                case "same":
                    boolArr.push(
                        moment(value, requirementObj["format"], true).isSame(
                            requirementObj[rule]
                        )
                    );
                    break;
            }
        }

        return boolArr.indexOf(false) == -1 ? true : false;
    }

    /**
     * Check if the provided value is a valid JSON string
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @return boolean
     */
    static validateJson(value, requirement, attribute) {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Check if the provided value is a valid JSON format as per given type
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @param  Object passes
     * @return boolean
     */
    static async validateJsonFormat(value, requirement, attribute, passes) {
        try {
            let jsonObj = value;

            switch (requirement) {
                case "program_checklist":
                    if (
                        !App.helpers.isObject(jsonObj) ||
                        App.helpers.isEmpty(jsonObj)
                    ) {
                        return passes(false);
                    }

                    App.lodash.forIn(jsonObj, async (val, key) => {
                        if (!App.lodash.isBoolean(val)) {
                            console.log("--------------->>>>>>>>> isBoolean");
                            return passes(false);
                        }

                        let progChecklist = await Models.StudentProgramChecklist.findOne(
                            {
                                where: { id: key }
                            }
                        );

                        if (App.lodash.isEmpty(progChecklist)) {
                            return passes(false);
                        }
                    });

                    return passes();

            }
        } catch (e) {
            return passes(false);
        }

        return passes(false);
    }

    /**
     * Check if the provided value is a valid JSON string
     *
     * @param  string value
     * @param  string attribute
     * @param  string requirement
     * @return boolean
     */
    static validateInBool(value, requirement, attribute) {
        let requirementArr = requirement.split(",");
        let resultVal = false;
        for (let i = 0; i < requirementArr.length; i++) {
            let reqVal = requirementArr[i];
            if (!App.lodash.isBoolean(Boolean(reqVal))) {
                return false;
            }
            if (Boolean(value) === Boolean(reqVal)) {
                resultVal = true;
            }
        }

        return resultVal;
    }

    static async validateExistIn(value, requirement, attribute, passes) {
        const uniqueEntities = [...new Set(value)];
        let [modelStr, columnName] = requirement.split(',');
        let Model = Models[App.helpers.config(`models.${modelStr}`)];

        const uniqueEntitiesCount = await Model.count({
            where: {
                [`${columnName}`]: {
                    [Op.in]: uniqueEntities
                }
            }
        });

        console.log(uniqueEntitiesCount, uniqueEntities.length);

        if (uniqueEntities.length != uniqueEntitiesCount) {
            passes(false);
        }

        passes();
    }

}

CustomValidator.messages = {
    unique: "The :attribute has already been taken.",
    exist: "The :attribute does not exist.",
    exist_in: "The :attribute does not exist.",
    pivot_not_exist: "The :attribute is already associated.",
    gt: "The :attribute must be greater.",
    gte: "The :attribute must be greater or equal.",
    lt: "The :attribute must be less.",
    lte: "The :attribute must be less or equal.",
    mimeTypes: "The :attribute is not valid image.",
    imageSize: "The :attribute is not of valid size.",
    fileSize: "The :attribute should have size below 2MB.",
    dimensions: "The :attribute does not have valid dimensions.",
    youtube_url: "The :attribute is not a valid youtube URL.",
    datetime: "The :attribute is not a valid date/time.",
    json: "The :attribute must be a valid JSON string.",
    json_format: "The :attribute must be a valid JSON string.",
    student_program_document_sessions: "The selected :attribute is invalid.",
    in_bool: "The :attribute is invalid.",
    multiple_document_assignments:
        "Documents with writers already assigned cannot be used in multi-assignment ",
    counsellor_student_relation:
        "You cannot access the details for this student",
    counsellor_college_relation:
        "You are not authorized to accces this college program",
    shortlist_college_programs_for_student:
        "The college programs given have some invalid data",
    update_shortlisted_college: "The selected fields are not valid",
    update_counsellor_approval_status: "The request contains some invalid data",
    counsellor_manager_counsellor_relation:
        "You cannot access the details for this counsellor",
    writer_manager_writer_relation:
        "You cannot access the details for this writer",
    writer_student_relation: "You cannot access the details for this student",
    writer_document_relation: "You cannot access the details for this document",
    uploaded_file_mime_type: "The file uploaded is invalid",
    // student_roadmap: "The :attribute has invalid data",
    roadmap_deadline: "The date given is not valid"
};

module.exports = CustomValidator;
