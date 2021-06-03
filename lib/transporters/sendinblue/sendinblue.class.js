"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendinblueTransporter = void 0;
const container_service_1 = require("./../../services/container.service");
const transporter_class_1 = require("./../transporter.class");
const sending_error_class_1 = require("./../../classes/sending-error.class");
const sending_response_class_1 = require("./../../classes/sending-response.class");
const compiler_enum_1 = require("./../../types/enums/compiler.enum");
/**
 * Set a Sendinblue transporter for mail sending.
 *
 * @dependency nodemailer
 * @dependency nodemailer-sendinblue-transport
 * @dependency Fork of nodemailer-sendinblue-transport https://github.com/konfer-be/nodemailer-sendinblue-transport.git
 *
 * @see https://nodemailer.com/smtp/
 * @see https://www.npmjs.com/package/nodemailer-sendinblue-transport
 * @see https://fr.sendinblue.com/
 * @see https://apidocs.sendinblue.com/tutorial-sending-transactional-email/
 *
 */
class SendinblueTransporter extends transporter_class_1.Transporter {
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
            headers: {
                'api-key': container_service_1.Container.configuration.mode?.api.credentials.apiKey,
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            to: this.addresses(payload.meta.to),
            from: this.address(payload.meta.from),
            replyTo: this.address(payload.meta.replyTo),
            subject: payload.meta.subject
        };
        switch (payload.compiler.valueOf()) {
            case compiler_enum_1.COMPILER.provider:
                Object.assign(output, {
                    params: payload.data,
                    templateId: parseInt(templateId, 10)
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
                        content: attachment.content,
                        filename: attachment.filename,
                        name: attachment.filename
                    };
                })
            });
        }
        return output;
    }
    /**
     * @description Format email address according to Sendinblue requirements
     *
     * @param recipient  Entry to format as email address
     */
    address(recipient) {
        if (typeof recipient === 'string') {
            return { email: recipient };
        }
        return recipient;
    }
    /**
     * @description Format email addresses according to Sendinblue requirements
     *
     * @param recipients Entries to format as email address
     */
    addresses(recipients) {
        return [...recipients].map((recipient) => this.address(recipient));
    }
    /**
     * @description Format API response
     *
     * @param response Response from Sendinblue API
     */
    response(response) {
        const res = new sending_response_class_1.SendingResponse();
        res
            .set('uri', null)
            .set('httpVersion', response.res.httpVersion)
            .set('headers', response.res.headers)
            .set('method', response.res.method)
            .set('body', response.body)
            .set('statusCode', 202)
            .set('statusMessage', response.res.statusMessage);
        return res;
    }
    /**
     * @description Format error output
     *
     * @param error Error from Sendgrid API
     */
    error(error) {
        const errorCode = /[0-9]+/;
        const statusCode = errorCode.exec(error.message);
        return new sending_error_class_1.SendingError(parseInt(statusCode[0], 10), error.name, [error.message]);
    }
}
exports.SendinblueTransporter = SendinblueTransporter;
