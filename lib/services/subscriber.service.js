"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber = void 0;
const mailer_service_1 = require("@services/mailer.service");
/**
 * @description
 */
class Subscriber {
    constructor(event) {
        this.event = event;
    }
    /**
     * @description
     */
    async handler(event, payload, origin) {
        return mailer_service_1.Mailer.send(event, payload);
    }
}
exports.Subscriber = Subscriber;
