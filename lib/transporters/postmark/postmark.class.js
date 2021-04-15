"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostmarkTransporter = void 0;
const transporter_class_1 = require("@transporters/transporter.class");
const sending_response_class_1 = require("@classes/sending-response.class");
const sending_error_class_1 = require("@classes/sending-error.class");
const compiler_enum_1 = require("@enums/compiler.enum");
const debug_decorator_1 = require("@decorators/debug.decorator");
/**
 * Set a Postmark transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-postmark-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-postmark-transport
 * @see https://postmarkapp.com/developer
 */
class PostmarkTransporter extends transporter_class_1.Transporter {
    /**
     * @description
     *
     * @param transporterEngine
     * @param domain Domain which do the request
     */
    constructor(transporterEngine) {
        super();
        this.transporter = transporterEngine;
    }
    /**
     * @description Build body request according to Mailjet requirements
     */
    build({ ...args }) {
        const { payload, templateId, body } = args;
        const output = {
            from: this.address(payload.meta.from),
            to: this.addresses(payload.meta.to),
            replyTo: this.address(payload.meta.replyTo),
            subject: payload.meta.subject
        };
        switch (payload.compiler.valueOf()) {
            case compiler_enum_1.COMPILER.provider:
                Object.assign(output, {
                    templateModel: payload.data,
                    templateId: payload.meta.templateId || parseInt(templateId, 10)
                });
                break;
            case compiler_enum_1.COMPILER.default:
            case compiler_enum_1.COMPILER.self:
                Object.assign(output, {
                    text: body.text,
                    html: body.html
                });
                break;
        }
        if (typeof (payload.meta.cc) !== 'undefined') {
            Object.assign(output, { cc: this.addresses(payload.meta.cc) });
        }
        if (typeof (payload.meta.bcc) !== 'undefined') {
            Object.assign(output, { bcc: this.addresses(payload.meta.bcc) });
        }
        if (typeof (payload.meta.attachments) !== 'undefined') {
            Object.assign(output, {
                attachments: payload.meta.attachments.map((attachment) => {
                    return {
                        contentTransferEncoding: 'base64',
                        content: attachment.content,
                        filename: attachment.filename,
                        cid: 'cid:' + attachment.filename
                    };
                })
            });
        }
        return output;
    }
    /**
     * @description Format email address according to Postmark requirements
     *
     * @param recipient
     */
    address(recipient) {
        if (typeof recipient === 'string') {
            return recipient;
        }
        return typeof recipient.name !== 'undefined' ? `${recipient.name} ${recipient.email}` : recipient.email;
    }
    /**
     * @description Format email addresses according to Postmark requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients) {
        return [...recipients].map((recipient) => this.address(recipient));
    }
    /**
     * @description Format API response
     *
     * @param response Response from Postmark API
     */
    response(response) {
        const res = new sending_response_class_1.SendingResponse();
        res
            .set('uri', null)
            .set('httpVersion', null)
            .set('headers', null)
            .set('method', 'POST')
            .set('body', response)
            .set('statusCode', 202)
            .set('statusMessage', null);
        return res;
    }
    /**
     * @description Format error output
     *
     * @param error Error from Postmark API
     */
    error(error) {
        return new sending_error_class_1.SendingError(error.statusCode || error.code, error.name || error.message, error.hasOwnProperty('response') ? error.response.body.errors : [error.message]);
    }
}
__decorate([
    debug_decorator_1.Debug('postmark'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], PostmarkTransporter.prototype, "build", null);
exports.PostmarkTransporter = PostmarkTransporter;
