"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.password = void 0;
const Joi = require("joi");
const password = (type) => {
    const types = [
        {
            type: 'user',
            schema: Joi.string().min(8).max(24)
        },
        {
            type: 'smtp',
            schema: Joi.string().min(8).max(24)
        }
    ];
    return types.filter(h => h.type === type).slice().shift().schema;
};
exports.password = password;
