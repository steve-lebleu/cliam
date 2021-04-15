"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtp = void 0;
const Joi = require("joi");
const host_schema_1 = require("@schemas/host.schema");
const port_schema_1 = require("@schemas/port.schema");
const username_schema_1 = require("@schemas/username.schema");
const password_schema_1 = require("@schemas/password.schema");
const smtp = () => {
    return Joi.object({
        host: host_schema_1.host('smtp').required(),
        port: port_schema_1.port().required(),
        secure: Joi.boolean().default(false),
        username: username_schema_1.username().required(),
        password: password_schema_1.password('smtp').required(),
    });
};
exports.smtp = smtp;
