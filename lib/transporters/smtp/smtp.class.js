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
exports.SmtpTransporter = void 0;
const transporter_class_1 = require("@transporters/transporter.class");
const sending_error_class_1 = require("@classes/sending-error.class");
const sending_response_class_1 = require("@classes/sending-response.class");
const http_method_enum_1 = require("@enums/http-method.enum");
const debug_decorator_1 = require("@decorators/debug.decorator");
/**
 * Set a Nodemailer SMTP transporter for mail sending.
 *
 * @dependency nodemailer
 *
 * @see https://nodemailer.com/smtp/
 */
class SmtpTransporter extends transporter_class_1.Transporter {
    /**
     * @description
     */
    constructor(transporterEngine) {
        super();
        this.transporter = transporterEngine;
    }
    /**
     * @description Build body request according to Mailjet requirements
     */
    build({ ...args }) {
        const { payload, body } = args;
        const output = {
            from: this.address(payload.meta.from),
            to: this.addresses(payload.meta.to),
            replyTo: this.address(payload.meta.replyTo),
            subject: payload.meta.subject
        };
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
                        filename: attachment.filename,
                        content: attachment.content,
                        encoding: 'base64'
                    };
                })
            });
        }
        Object.assign(output, {
            text: body.text,
            html: body.html
        });
        return output;
    }
    /**
     * @description Format email address according to SMTP requirements
     *
     * @param recipient
     */
    address(recipient) {
        if (typeof recipient === 'string') {
            return recipient;
        }
        return typeof recipient.name !== 'undefined' ? `${recipient.name} <${recipient.email}>` : `<${recipient.email}>`;
    }
    /**
     * @description Format email addresses according to SMTP requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients) {
        return [...recipients].map((recipient) => this.address(recipient));
    }
    /**
     * @description Format API response
     *
     * @param response Response from Nodemailer SMTP API
     */
    response(response) {
        const incoming = response;
        const res = new sending_response_class_1.SendingResponse();
        return res
            .set('accepted', incoming.accepted)
            .set('uri', null)
            .set('httpVersion', null)
            .set('headers', null)
            .set('method', http_method_enum_1.HTTP_METHOD.POST)
            .set('body', incoming.envelope)
            .set('statusCode', 202)
            .set('statusMessage', incoming.response)
            .set('messageId', incoming.messageId);
    }
    /**
     * @description Format error output
     *
     * @param error Error from Nodemailer SMTP API
     *
     * @fixme Non managed error with smtp.gmail.com and secure true : error have a different pattern and this regError.exec(error.response)[0] not working
     */
    error(error) {
        if (error instanceof TypeError) {
            return new sending_error_class_1.SendingError(417, error.name, [error.message]);
        }
        if (this.transporter.options.host === 'smtp.gmail.com') {
            error = error;
            const regError = /[A-Z]{1}[a-z\s\W]+\./g;
            const matchError = regError.exec(error.response)[0];
            const regHelp = /https:\/\/[a-z-A-Z0-9\w\.-\/\?\=]+/g;
            const matchHelp = regHelp.exec(error.response)[0];
            return new sending_error_class_1.SendingError(error.responseCode, error.code.toString(), [matchError]);
        }
        if (this.transporter.options.host === 'mail.infomaniak.com') {
            error = error;
            return new sending_error_class_1.SendingError(403, error.errno.toString(), [error.errno.toString()]);
        }
        error = error;
        return new sending_error_class_1.SendingError(error.responseCode, error.code.toString(), [error.response]);
    }
}
__decorate([
    debug_decorator_1.Debug('smtp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], SmtpTransporter.prototype, "build", null);
exports.SmtpTransporter = SmtpTransporter;
