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
exports.MailjetTransporter = void 0;
const transporter_class_1 = require("@transporters/transporter.class");
const sending_error_class_1 = require("@classes/sending-error.class");
const sending_response_class_1 = require("@classes/sending-response.class");
const compiler_enum_1 = require("@enums/compiler.enum");
const error_util_1 = require("@utils/error.util");
const debug_decorator_1 = require("@decorators/debug.decorator");
/**
 * Set a Mailjet transporter for mail sending.
 *
 * @dependency node-mailjet
 *
 * @see https://fr.mailjet.com/
 * @see https://github.com/mailjet/mailjet-apiv3-nodejs
 * @see https://dev.mailjet.com/guides/
 */
class MailjetTransporter extends transporter_class_1.Transporter {
    /**
     * @description
     *
     * @param transporterEngine
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
            Messages: [{
                    From: this.address(payload.meta.from),
                    To: this.addresses(payload.meta.to),
                    'h:Reply-To': this.address(payload.meta.from),
                    Subject: payload.meta.subject
                }]
        };
        switch (payload.compiler.valueOf()) {
            case compiler_enum_1.COMPILER.provider:
                Object.assign(output.Messages[0], { Variables: payload.data });
                Object.assign(output.Messages[0], { TemplateLanguage: true });
                Object.assign(output.Messages[0], { TemplateID: parseInt(templateId, 10) });
                break;
            case compiler_enum_1.COMPILER.default:
            case compiler_enum_1.COMPILER.self:
                Object.assign(output.Messages[0], {
                    TextPart: body.text,
                    HTMLPart: body.html
                });
                break;
        }
        if (typeof (payload.meta.cc) !== 'undefined') {
            Object.assign(output.Messages[0], { Cc: this.addresses(payload.meta.cc) });
        }
        if (typeof (payload.meta.bcc) !== 'undefined') {
            Object.assign(output.Messages[0], { Bcc: this.addresses(payload.meta.bcc) });
        }
        if (typeof (payload.meta.attachments) !== 'undefined') {
            Object.assign(output.Messages[0], {
                Attachments: payload.meta.attachments.map((attachment) => {
                    return {
                        ContentType: attachment.type,
                        Filename: attachment.filename,
                        Base64Content: attachment.content
                    };
                })
            });
        }
        return output;
    }
    /**
     * @description Format email address according to Mailjet requirements
     *
     * @param recipient
     */
    address(recipient) {
        if (typeof recipient === 'string') {
            return { Email: recipient };
        }
        return typeof recipient.name !== 'undefined' ? { Email: recipient.email, Name: recipient.name } : { Email: recipient.email };
    }
    /**
     * @description Format email addresses according to Mailjet requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients) {
        return [...recipients].map((recipient) => this.address(recipient));
    }
    /**
     * @description Format API response
     *
     * @param response Response from Mailjet API
     */
    response(response) {
        const incoming = response.response;
        const res = new sending_response_class_1.SendingResponse();
        res
            .set('uri', `${incoming.res.connection.servername} ${incoming.res.req.path}`)
            .set('httpVersion', incoming.res.httpVersion)
            .set('headers', incoming.res.headers)
            .set('method', incoming.req.method)
            .set('body', incoming.body)
            .set('statusCode', 202)
            .set('statusMessage', incoming.res.statusMessage);
        return res;
    }
    /**
     * @description Format error output
     *
     * @param error Error from Mailgun API
     */
    error(error) {
        const err = JSON.parse(error.response.res.text);
        const messages = err.ErrorMessage ? err.ErrorMessage : error_util_1.getMailjetErrorMessages(err.Messages);
        return new sending_error_class_1.SendingError(error.statusCode, error.ErrorMessage, Array.isArray(messages) ? messages : [messages]);
    }
}
__decorate([
    debug_decorator_1.Debug('mailjet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], MailjetTransporter.prototype, "build", null);
exports.MailjetTransporter = MailjetTransporter;
