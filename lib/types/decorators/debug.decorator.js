"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
const container_service_1 = require("@services/container.service");
const transporter_enum_1 = require("@enums/transporter.enum");
/**
 * @description
 *
 * @param transporter
 */
const Debug = (transporter) => {
    return (target, key) => {
        const method = target[key];
        target[key] = function (...args) {
            const output = method.apply(this, args);
            if (output) {
                if (container_service_1.Container.configuration?.sandbox?.active) {
                    switch (transporter) {
                        case transporter_enum_1.TRANSPORTER.mailjet:
                            Object.assign(output, {
                                SandboxMode: true,
                                mail_settings: {
                                    sandbox_mode: {
                                        enable: true
                                    }
                                }
                            });
                            output.Messages[0].From = { Email: container_service_1.Container.configuration.sandbox.from.email, Name: container_service_1.Container.configuration.sandbox.from.name };
                            break;
                        case transporter_enum_1.TRANSPORTER.sendgrid:
                            Object.assign(output, {
                                mail_settings: {
                                    sandbox_mode: {
                                        enable: true
                                    }
                                }
                            });
                            break;
                        case transporter_enum_1.TRANSPORTER.postmark:
                            output.from = `${container_service_1.Container.configuration.sandbox.from.name} ${container_service_1.Container.configuration.sandbox.from.email}`;
                            output.to = [].concat(output.to).map((recipient) => {
                                return `${container_service_1.Container.configuration.sandbox.to.name} ${container_service_1.Container.configuration.sandbox.to.email}`;
                            });
                            if (output.cc) {
                                output.cc = [].concat(output.cc).map((recipient) => {
                                    return `${container_service_1.Container.configuration.sandbox.to.name} ${container_service_1.Container.configuration.sandbox.to.email}`;
                                });
                            }
                            if (output.bcc) {
                                output.bcc = [].concat(output.bcc).map((recipient) => {
                                    return `${container_service_1.Container.configuration.sandbox.to.name} ${container_service_1.Container.configuration.sandbox.to.email}`;
                                });
                            }
                            break;
                    }
                }
                return output;
            }
        };
        return target[key];
    };
};
exports.Debug = Debug;
