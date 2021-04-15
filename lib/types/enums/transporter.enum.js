"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSPORTER = void 0;
/**
 * @description Define supported email transporters
 */
var TRANSPORTER;
(function (TRANSPORTER) {
    TRANSPORTER["sparkpost"] = "sparkpost";
    TRANSPORTER["sendgrid"] = "sendgrid";
    TRANSPORTER["sendinblue"] = "sendinblue";
    TRANSPORTER["mandrill"] = "mandrill";
    TRANSPORTER["mailgun"] = "mailgun";
    TRANSPORTER["mailjet"] = "mailjet";
    TRANSPORTER["postmark"] = "postmark";
    TRANSPORTER["smtp"] = "smtp";
})(TRANSPORTER = exports.TRANSPORTER || (exports.TRANSPORTER = {}));
