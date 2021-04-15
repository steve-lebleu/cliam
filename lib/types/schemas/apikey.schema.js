"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apikey = void 0;
const Joi = require("joi");
const transporter_enum_1 = require("@enums/transporter.enum");
const enum_util_1 = require("@utils/enum.util");
const apikey = () => {
    return Joi.when('name', {
        is: Joi.any().valid(...enum_util_1.list(transporter_enum_1.TRANSPORTER)).required(),
        then: Joi
            .when('name', {
            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mailgun),
            then: Joi.string().regex(/^[a-z-0-9]{32}-[a-z-0-9]{8}-[a-z-0-9]{8}$/)
        })
            .when('name', {
            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mailjet),
            then: Joi.string().regex(/^[a-z-0-9]{32}$/)
        })
            .when('api.name', {
            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mandrill),
            then: Joi.string().regex(/[a-z]/)
        })
            .when('mode.api.name', {
            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sparkpost),
            then: Joi.string().regex(/^[a-z-0-9]{40}$/)
        })
            .when('mode.api.name', {
            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sendinblue),
            then: Joi.string().regex(/^xkeysib-[a-z-0-9]{64}-[a-z-A-Z-0-9]{16}$/)
        })
            .when('mode.api.name', {
            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.sendgrid),
            then: Joi.string().regex(/^[a-z-A-Z-0-9\\-\\.\\_]{69}$/)
        })
            .when('mode.api.name', {
            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.postmark),
            then: Joi.string().regex(/^[a-z-0-9]{8}-[a-z-0-9]{4}-[a-z-0-9]{4}-[a-z-0-9]{4}-[a-z-0-9]{12}$/)
        })
    });
};
exports.apikey = apikey;
