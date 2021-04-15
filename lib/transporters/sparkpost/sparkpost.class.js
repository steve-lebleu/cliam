"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparkpostTransporter = void 0;
const transporter_class_1 = require("../transporter.class");
const sending_error_class_1 = require("../../classes/sending-error.class");
const sending_response_class_1 = require("../../classes/sending-response.class");
const compiler_enum_1 = require("../../types/enums/compiler.enum");
/**
 * Set a Sparkpost transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sparkpost-transport
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sparkpost-transport
 * @see https://app.sparkpost.com
 * @see https://developers.sparkpost.com/api/
 */
class SparkpostTransporter extends transporter_class_1.Transporter {
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
     * @description Build body request according to Sparkpost requirements
     */
    build({ ...args }) {
        const { payload, templateId, body } = args;
        let cc = [];
        let bcc = [];
        const output = {
            recipients: this.addresses(payload.meta.to),
            content: {
                from: payload.meta.from,
                subject: payload.meta.subject,
                reply_to: `${payload.meta.replyTo.name} <${payload.meta.replyTo.email}>`,
            }
        };
        switch (payload.compiler.valueOf()) {
            case compiler_enum_1.COMPILER.provider:
                Object.assign(output, {
                    substitution_data: payload.data,
                });
                Object.assign(output.content, {
                    template_id: templateId,
                    use_draft_template: false
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
            cc = payload.meta.cc.map((recipient) => {
                const addr = this.address(recipient);
                const primary = payload.meta.to[0];
                Object.assign(addr, { header_to: typeof primary === 'string' ? primary : primary.email });
                return addr;
            });
            output.recipients = [].concat(output.recipients).concat(cc);
        }
        if (typeof (payload.meta.bcc) !== 'undefined') {
            bcc = payload.meta.bcc.map((recipient) => {
                const addr = this.address(recipient);
                const primary = payload.meta.to[0];
                Object.assign(addr, { header_to: typeof primary === 'string' ? primary : primary.email });
                return addr;
            });
            output.recipients = [].concat(output.recipients).concat(bcc);
        }
        if (cc.length > 0 && bcc.length > 0) {
            Object.assign(output.content, {
                headers: {
                    CC: cc.map((recipient) => recipient.email)
                }
            });
        }
        if (typeof (payload.meta.attachments) !== 'undefined') {
            Object.assign(output.content, {
                attachments: payload.meta.attachments.map((attachment) => {
                    return {
                        name: attachment.filename,
                        type: attachment.type,
                        data: attachment.content
                    };
                })
            });
        }
        return output;
    }
    /**
     * @description Format email address according to Sparkpost requirements
     *
     * @param recipient
     */
    address(recipient) {
        return { address: recipient };
    }
    /**
     * @description Format email addresses according to Sparkpost requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients) {
        return [...recipients].map((recipient) => this.address(recipient));
    }
    /**
     * @description Format API response
     *
     * @param response Response from Sparkpost API
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
     * @param error Error from Sparkpost API
     */
    error(error) {
        return new sending_error_class_1.SendingError(error.statusCode, error.errors[0].message, [error.errors[0]?.description || '']);
    }
}
exports.SparkpostTransporter = SparkpostTransporter;
