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
exports.SendgridTransporter = void 0;
const transporter_class_1 = require("@transporters/transporter.class");
const sending_response_class_1 = require("@classes/sending-response.class");
const sending_error_class_1 = require("@classes/sending-error.class");
const compiler_enum_1 = require("@enums/compiler.enum");
const debug_decorator_1 = require("@decorators/debug.decorator");
/**
 * Set a Sendgrid transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sendgrid
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sendgrid
 * @see https://sendgrid.com/
 * @see https://sendgrid.com/docs/API_Reference/api_v3.html
 */
class SendgridTransporter extends transporter_class_1.Transporter {
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
            from: this.address(payload.meta.from, 'from'),
            personalizations: [{
                    to: this.addresses(payload.meta.to),
                }],
            to: this.addresses(payload.meta.to),
            reply_to: this.address(payload.meta.replyTo),
            subject: payload.meta.subject
        };
        switch (payload.compiler.valueOf()) {
            case compiler_enum_1.COMPILER.provider:
                Object.assign(output, {
                    dynamic_template_data: payload.data,
                    templateId: payload.meta.templateId || templateId
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
            Object.assign(output.personalizations, { cc: this.addresses(payload.meta.cc) });
        }
        if (typeof (payload.meta.bcc) !== 'undefined') {
            Object.assign(output.personalizations, { bcc: this.addresses(payload.meta.bcc) });
        }
        if (typeof (payload.meta.attachments) !== 'undefined') {
            Object.assign(output, { attachments: payload.meta.attachments });
        }
        return output;
    }
    /**
     * @description Format email address according to Sendgrid requirements
     *
     * @param recipient  Entry to format as email address
     * @param type Discriminator
     */
    address(recipient, type) {
        if (typeof recipient === 'string') {
            return type === 'from' ? recipient : { email: recipient };
        }
        return type === 'from' ? recipient.email : { email: recipient.email, name: recipient.name };
    }
    /**
     * @description Format email addresses according to Sendgrid requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients) {
        return [...recipients].map((recipient) => this.address(recipient));
    }
    /**
     * @description Format API response
     *
     * @param response Response from Sendgrid API
     */
    response(response) {
        const incoming = response.shift();
        const res = new sending_response_class_1.SendingResponse();
        res
            .set('uri', incoming.request.uri)
            .set('httpVersion', incoming.httpVersion)
            .set('headers', incoming.headers)
            .set('method', incoming.request.method)
            .set('body', incoming.request.body)
            .set('statusCode', 202)
            .set('statusMessage', incoming.statusMessage);
        return res;
    }
    /**
     * @description Format error output
     *
     * @param error Error from Sendgrid API
     */
    error(error) {
        return new sending_error_class_1.SendingError(error.code || error.statusCode, error.name || error.message, error.hasOwnProperty('response') ? error.response.body.errors : [error.message]);
    }
}
__decorate([
    debug_decorator_1.Debug('sendgrid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], SendgridTransporter.prototype, "build", null);
exports.SendgridTransporter = SendgridTransporter;
