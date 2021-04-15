"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSchema = void 0;
const Joi = require("joi");
const compiler_enum_1 = require("@enums/compiler.enum");
const attachment_mime_type_enum_1 = require("@enums/attachment-mime-type.enum");
const attachment_disposition_enum_1 = require("@enums/attachment-disposition.enum");
const buffer_mime_type_enum_1 = require("@enums/buffer-mime-type.enum");
const recipient_schema_1 = require("@schemas/recipient.schema");
const enum_util_1 = require("@utils/enum.util");
const addresses = () => {
    return Joi.alternatives().try(recipient_schema_1.recipient().required(), Joi.array().items(recipient_schema_1.recipient()).required());
};
const mailSchema = Joi.object({
    compiler: Joi.any().valid(...enum_util_1.list(compiler_enum_1.COMPILER)),
    meta: Joi.object({
        subject: Joi.string().max(128).required(),
        from: recipient_schema_1.recipient(),
        replyTo: recipient_schema_1.recipient(),
        to: addresses().required(),
        cc: addresses(),
        bcc: addresses(),
        attachments: Joi.array().items(Joi.object({
            content: Joi.alternatives([Joi.string().base64(), Joi.string().regex(/^data:[a-zA-Z-\/]{1,48};base64,.*$/)]).required(),
            type: Joi.any().valid(...enum_util_1.list(attachment_mime_type_enum_1.ATTACHMENT_MIME_TYPE)),
            filename: Joi.string().regex(/[a-z-A-Z-0-9]{2,}\.[a-z]{3,4}/).required(),
            disposition: Joi.any().valid(...enum_util_1.list(attachment_disposition_enum_1.ATTACHMENT_DISPOSITION)).default(attachment_disposition_enum_1.ATTACHMENT_DISPOSITION.attachment)
        }))
    }).required(),
    content: Joi.array().items(Joi.object({
        type: Joi.any().valid(buffer_mime_type_enum_1.BUFFER_MIME_TYPE['text/html']).required(),
        value: Joi.string().required()
    }).required(), Joi.object({
        type: Joi.any().valid(...enum_util_1.list(buffer_mime_type_enum_1.BUFFER_MIME_TYPE)).required(),
        value: Joi.string().required()
    })).max(2),
    data: Joi.object()
}).xor('content', 'data').required();
exports.mailSchema = mailSchema;
