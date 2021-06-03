"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailjetErrorMessages = void 0;
/**
 * @description
 *
 * @param input
 */
const getMailjetErrorMessages = (input) => {
    return input.map((message) => message.Errors.map((error) => error.ErrorMessage).join(','));
};
exports.getMailjetErrorMessages = getMailjetErrorMessages;
