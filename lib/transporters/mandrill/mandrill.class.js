"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandrillTransporter = void 0;
const transporter_class_1 = require("./../transporter.class");
const sending_error_class_1 = require("./../../classes/sending-error.class");
const sending_response_class_1 = require("./../../classes/sending-response.class");
const compiler_enum_1 = require("./../../types/enums/compiler.enum");
/**
 * Set a Mandrill transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-mandrill-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-mandrill-transport
 * @see https://mandrillapp.com/api/docs/
 * @see https://bitbucket.org/mailchimp/mandrill-api-node/src
 */
class MandrillTransporter extends transporter_class_1.Transporter {
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
     * @description Build body request according to Mailgun requirements
     */
    build({ ...args }) {
        const { payload, templateId, body } = args;
        const output = {
            message: {
                subject: payload.meta.subject,
                from_email: this.address(payload.meta.from.email, 'single'),
                from_name: payload.meta.from.name,
                to: this.addresses(payload.meta.to, 'to'),
                headers: {
                    'Reply-To': this.address(payload.meta.replyTo, 'single')
                },
                track_opens: true,
                track_click: true,
                preserve_recipients: true
            }
        };
        switch (payload.compiler.valueOf()) {
            case compiler_enum_1.COMPILER.provider:
                Object.assign(output, {
                    template_content: [payload.data],
                    template_name: payload.meta.templateId || templateId
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
            output.message.to = [].concat(output.message.to).concat(this.addresses(payload.meta.cc, 'cc'));
        }
        if (typeof (payload.meta.bcc) !== 'undefined') {
            output.message.to = [].concat(output.message.to).concat(this.addresses(payload.meta.bcc, 'bcc'));
        }
        if (typeof (payload.meta.attachments) !== 'undefined') {
            Object.assign(output.message, { attachments: payload.meta.attachments.map((attachment) => {
                    return { type: attachment.type, name: attachment.filename, content: attachment.content };
                }) });
        }
        return output;
    }
    /**
     * @description Format email address according to Mandrill requirements
     *
     * @param recipient Entry to format as email address
     * @param type type Discriminator for body property settings
     */
    address(recipient, type) {
        if (typeof recipient === 'string') {
            return recipient;
        }
        if (type === 'single') {
            return recipient.email;
        }
        return typeof recipient.name !== 'undefined' ? { email: recipient.email, name: recipient.name, type } : { email: recipient.email };
    }
    /**
     * @description Format email addresses according to Mandrill requirements
     *
     * @param recipients Entries to format as email address
     * @param type Discriminator for body property settings
     */
    addresses(recipients, type) {
        return [...recipients].map((recipient) => this.address(recipient, type));
    }
    /**
     * @description Format API response
     *
     * @param response Response from Mandrill API
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
     * @param error Error from Mandrill API
     */
    error(error) {
        return new sending_error_class_1.SendingError(500, '', ['']);
    }
}
exports.MandrillTransporter = MandrillTransporter;
