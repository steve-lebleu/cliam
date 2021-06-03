"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransporterFactory = void 0;
const sparkpostTransport = require("nodemailer-sparkpost-transport");
const mailgunTransport = require("nodemailer-mailgun-transport");
const mandrillTransport = require("nodemailer-mandrill-transport");
const postmarkTransport = require("nodemailer-postmark-transport");
const sendgridTransport = require("nodemailer-sendgrid");
const sendinblueTransport = require("nodemailer-sendinblue-transport");
const mailjetTransport = require("node-mailjet");
const nodemailer_1 = require("nodemailer");
const transporter_enum_1 = require("../types/enums/transporter.enum");
const smtp_class_1 = require("./smtp/smtp.class");
const sparkpost_class_1 = require("./sparkpost/sparkpost.class");
const sendgrid_class_1 = require("./sendgrid/sendgrid.class");
const sendinblue_class_1 = require("./sendinblue/sendinblue.class");
const mandrill_class_1 = require("./mandrill/mandrill.class");
const mailgun_class_1 = require("./mailgun/mailgun.class");
const mailjet_class_1 = require("./mailjet/mailjet.class");
const postmark_class_1 = require("./postmark/postmark.class");
/**
 * @description
 */
class TransporterFactory {
    constructor() { }
    /**
     * @description Get a concrete transporter instance
     *
     * @param key
     */
    static get(key, { ...args }) {
        switch (key) {
            case transporter_enum_1.TRANSPORTER.mailgun:
                TransporterFactory.engine = mailgunTransport({
                    auth: {
                        api_key: args.apiKey,
                        domain: args.domain
                    }
                });
                return new mailgun_class_1.MailgunTransporter(nodemailer_1.createTransport(TransporterFactory.engine));
            case transporter_enum_1.TRANSPORTER.mailjet:
                TransporterFactory.engine = mailjetTransport.connect(args.apiKey, args.token);
                TransporterFactory.engine.sendMail = (payload, callback) => {
                    return TransporterFactory.engine
                        .post('send', { version: 'v3.1' })
                        .request(payload)
                        .then((result) => {
                        callback(null, result);
                    })
                        .catch((error) => {
                        callback(error, null);
                    });
                };
                return new mailjet_class_1.MailjetTransporter(TransporterFactory.engine);
            case transporter_enum_1.TRANSPORTER.mandrill:
                TransporterFactory.engine = mandrillTransport({
                    auth: {
                        apiKey: args.apiKey
                    }
                });
                return new mandrill_class_1.MandrillTransporter(nodemailer_1.createTransport(TransporterFactory.engine));
            case transporter_enum_1.TRANSPORTER.postmark:
                TransporterFactory.engine = postmarkTransport({
                    auth: {
                        apiKey: args.apiKey
                    }
                });
                return new postmark_class_1.PostmarkTransporter(nodemailer_1.createTransport(TransporterFactory.engine));
            case transporter_enum_1.TRANSPORTER.sendgrid:
                TransporterFactory.engine = sendgridTransport({
                    apiKey: args.apiKey
                });
                return new sendgrid_class_1.SendgridTransporter(nodemailer_1.createTransport(TransporterFactory.engine));
            case transporter_enum_1.TRANSPORTER.sendinblue:
                TransporterFactory.engine = sendinblueTransport({
                    apiKey: args.apiKey,
                    apiUrl: 'https://api.sendinblue.com/v3/smtp'
                });
                return new sendinblue_class_1.SendinblueTransporter(nodemailer_1.createTransport(TransporterFactory.engine));
            case transporter_enum_1.TRANSPORTER.smtp:
                TransporterFactory.engine = ((options) => {
                    return nodemailer_1.createTransport({
                        host: options.host,
                        port: options.port,
                        secure: options.secure,
                        auth: {
                            user: options.username,
                            pass: options.password
                        },
                        greetingTimeout: 5000,
                        socketTimeout: 5000
                    });
                })(args.smtp);
                return new smtp_class_1.SmtpTransporter(TransporterFactory.engine);
            case transporter_enum_1.TRANSPORTER.sparkpost:
                TransporterFactory.engine = sparkpostTransport({
                    sparkPostApiKey: args.apiKey,
                    options: {
                        open_tracking: true,
                        click_tracking: true,
                        transactional: true
                    }
                });
                return new sparkpost_class_1.SparkpostTransporter(nodemailer_1.createTransport(TransporterFactory.engine));
        }
    }
}
exports.TransporterFactory = TransporterFactory;
TransporterFactory.engine = null;
/**
 * après création, pour le smtp ? OU ailleurs en fait
 * this.transporter.verify( (err, res) => {
        if (err) {
          reject(this.error(err));
        }
        resolve(this.transporter);
      });
 */ 
