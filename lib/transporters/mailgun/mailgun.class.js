"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailgunTransporter = void 0;
const transporter_class_1 = require("./../transporter.class");
const sending_error_class_1 = require("./../../classes/sending-error.class");
const sending_response_class_1 = require("./../../classes/sending-response.class");
const compiler_enum_1 = require("./../../types/enums/compiler.enum");
/**
 * This class set a Mailgun transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-mailgun-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-mailgun-transport
 * @see https://documentation.mailgun.com/en/latest/index.html
 */
class MailgunTransporter extends transporter_class_1.Transporter {
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
     * @description Format email address according to Mailgun requirements
     *
     * @param recipient
     */
    address(recipient) {
        if (typeof recipient === 'string') {
            return recipient;
        }
        return typeof recipient.name !== 'undefined' ? `${recipient.name} <${recipient.email}>` : recipient.email;
    }
    /**
     * @description Format email addresses according to Mailgun requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients) {
        return [...recipients].map((recipient) => this.address(recipient));
    }
    /**
     * @description Build body request according to Mailgun requirements
     */
    build({ ...args }) {
        const { payload, templateId, body } = args;
        const output = {
            from: this.address(payload.meta.from),
            to: this.addresses(payload.meta.to),
            'h:Reply-To': this.address(payload.meta.replyTo),
            subject: payload.meta.subject
        };
        switch (payload.compiler.valueOf()) {
            case compiler_enum_1.COMPILER.provider:
                Object.assign(output, {
                    'h:X-Mailgun-Variables': JSON.stringify(payload.data),
                    template: templateId
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
                        filename: attachment.filename,
                        content: attachment.content,
                        encoding: 'base64'
                    };
                })
            });
        }
        return output;
    }
    /**
     * @description Format API response
     *
     * @param response Response from Mailgun API
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
            .set('statusMessage', response.message);
        return res;
    }
    /**
     * @description Format error output
     *
     * @param error Error from Mailgun API
     */
    error(error) {
        return new sending_error_class_1.SendingError(error.statusCode, error.name || error.message, [error.message]);
    }
}
exports.MailgunTransporter = MailgunTransporter;
