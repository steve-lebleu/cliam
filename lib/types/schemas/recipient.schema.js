"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipient = void 0;
const Joi = require("joi");
const recipient = () => {
    return Joi.alternatives().try(Joi.string().email().required(), Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().max(48)
    }).required());
};
exports.recipient = recipient;
