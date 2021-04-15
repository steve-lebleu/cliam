"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const sending_error_class_1 = require("./../classes/sending-error.class");
const container_service_1 = require("./../services/container.service");
const compiler_service_1 = require("./../services/compiler.service");
const compiler_enum_1 = require("./../types/enums/compiler.enum");
const buffer_mime_type_enum_1 = require("./../types/enums/buffer-mime-type.enum");
const mail_validation_1 = require("./../validations/mail.validation");
/**
 * @description Manage incoming mail requests
 */
class Mailer {
    constructor(transporter) {
        /**
         * @description
         */
        this.transporter = null;
        /**
         * @description Send email
         */
        this.send = async (event, payload) => {
            this.setCompiler(event, payload);
            this.setAddresses(payload);
            const error = mail_validation_1.mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
            if (error) {
                return new sending_error_class_1.SendingError(400, 'Validation error', [error.details.shift().message]);
            }
            return await this.transporter.send(this.transporter.build(this.getBuildable(event, payload)));
        };
        this.transporter = transporter;
    }
    /**
     * @description
     */
    static get(transporter) {
        if (!Mailer.instance) {
            Mailer.instance = new Mailer(transporter);
        }
        return Mailer.instance;
    }
    /**
     * @description
     *
     * @param event
     * @param payload
     */
    setAddresses(payload) {
        payload.meta.from = !payload.meta.from ? container_service_1.Container.configuration.consumer?.addresses?.from : payload.meta.from;
        payload.meta.replyTo = !payload.meta.replyTo ? container_service_1.Container.configuration.consumer?.addresses?.replyTo : payload.meta.replyTo;
    }
    /**
     * @description
     *
     * @param event
     * @param payload
     */
    setCompiler(event, payload) {
        payload.compiler = payload.compiler ? payload.compiler : payload.content ? compiler_enum_1.COMPILER.self : this.getTemplateId(event) ? compiler_enum_1.COMPILER.provider : compiler_enum_1.COMPILER.default;
    }
    /**
     * @description
     *
     * @param event
     * @param payload
     */
    getBuildable(event, payload) {
        return {
            payload,
            templateId: payload.compiler === compiler_enum_1.COMPILER.provider ? this.getTemplateId(event) : null,
            body: [compiler_enum_1.COMPILER.self, compiler_enum_1.COMPILER.default].includes(payload.compiler) ? this.getCompilated(event, payload) : null,
            origin: this.getOrigin()
        };
    }
    /**
     * @description
     */
    getOrigin() {
        return container_service_1.Container.configuration.consumer.domain;
    }
    /**
     * @description
     */
    getTemplateId(event) {
        return container_service_1.Container.configuration.mode?.api?.templates[event];
    }
    /**
     * @description
     */
    hasPlainText(content) {
        return content.some((buffer) => buffer.type === buffer_mime_type_enum_1.BUFFER_MIME_TYPE['text/plain'] && buffer.value);
    }
    /**
     * @description
     */
    getCompilated(event, payload) {
        if (payload.compiler === compiler_enum_1.COMPILER.self && this.hasPlainText(payload.content)) {
            return {
                html: payload.content.find(b => b.type === buffer_mime_type_enum_1.BUFFER_MIME_TYPE['text/html']).value,
                text: payload.content.find(b => b.type === buffer_mime_type_enum_1.BUFFER_MIME_TYPE['text/plain']).value,
            };
        }
        if (payload.compiler === compiler_enum_1.COMPILER.self && !this.hasPlainText(payload.content)) {
            return {
                html: payload.content.find(b => b.type === buffer_mime_type_enum_1.BUFFER_MIME_TYPE['text/html']).value,
                text: compiler_service_1.Compiler.textify(payload.content.find(b => b.type === buffer_mime_type_enum_1.BUFFER_MIME_TYPE['text/html']).value),
            };
        }
        return compiler_service_1.Compiler.compile(event, Object.assign({ subject: payload.meta.subject }, payload.data));
    }
}
/**
 * @description
 */
Mailer.instance = null;
const service = Mailer.get(container_service_1.Container.transporter);
exports.Mailer = service;
