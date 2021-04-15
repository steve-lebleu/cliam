"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendingResponse = void 0;
/**
 * Sending response wrapper
 */
class SendingResponse {
    constructor() { }
    /**
     * @description Property setter
     *
     * @param property
     * @param value
     */
    set(property, value) {
        this[property] = value;
        return this;
    }
    /**
     * @description Property getter
     *
     * @param property
     */
    get(property) {
        return this[property];
    }
}
exports.SendingResponse = SendingResponse;
;
