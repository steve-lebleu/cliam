"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendingError = void 0;
/**
 * Type sending error
 */
class SendingError {
    constructor(status, message, errors) {
        this.statusCode = status;
        this.statusText = message;
        this.errors = errors;
    }
}
exports.SendingError = SendingError;
