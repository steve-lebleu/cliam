"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const Joi = require("joi");
const transporter_enum_1 = require("@enums/transporter.enum");
const enum_util_1 = require("@utils/enum.util");
const token = () => {
    return Joi.when('transporter', {
        is: Joi.any().valid(...enum_util_1.list(transporter_enum_1.TRANSPORTER)).required(),
        then: Joi
            .when('transporter', {
            is: Joi.any().valid(transporter_enum_1.TRANSPORTER.mailjet).required(),
            then: Joi.string().regex(/^[a-z-0-9]{32}$/).required(),
        })
    });
};
exports.token = token;
