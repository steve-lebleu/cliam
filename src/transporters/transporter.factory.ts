import * as sparkpostTransport from 'nodemailer-sparkpost-transport';
import * as mailgunTransport from 'nodemailer-mailgun-transport';
import * as mandrillTransport from 'nodemailer-mandrill-transport';
import * as PostmarkTransport from 'nodemailer-postmark-transport';
import * as sendgridTransport from 'nodemailer-sendgrid';
import * as sendinblueTransport from 'nodemailer-sendinblue-v3-transport';
import * as Mailjet from 'node-mailjet';

import { createTransport } from 'nodemailer';

import { Transporter as TransporterType } from '../types/types/transporter.type';
import { TRANSPORTER } from '../types/enums/transporter.enum';

import { Smtp } from '../classes/smtp.class';

import { Transporter } from './transporter.class';
import { SmtpTransporter } from './smtp/smtp.class';
import { SparkpostTransporter } from './sparkpost/sparkpost.class';
import { SendgridTransporter } from './sendgrid/sendgrid.class';
import { SendinblueTransporter } from './sendinblue/sendinblue.class';
import { MandrillTransporter } from './mandrill/mandrill.class';
import { MailgunTransporter } from './mailgun/mailgun.class';
import { MailjetTransporter } from './mailjet/mailjet.class';
import { PostmarkTransporter } from './postmark/postmark.class';

/**
 * @description
 */
export class TransporterFactory {

  private static engine = null;

  constructor() {}

  /**
   * @description Get a concrete transporter instance
   *
   * @param key
   */
  static get(key: TransporterType, { ...args }: { apiKey?: string, token?: string, smtp?: Smtp, domain?: string } ): Transporter {
    switch(key) {
      case TRANSPORTER.mailgun:
        TransporterFactory.engine = mailgunTransport({
          auth: {
            api_key: args.apiKey,
            domain: args.domain
          }
        }) as unknown;
        return new MailgunTransporter( createTransport( TransporterFactory.engine ) );
      case TRANSPORTER.mailjet:
        TransporterFactory.engine = new Mailjet.Client({
          apiKey: args.apiKey,
          apiSecret: args.token
        }) as unknown;
        return new MailjetTransporter( createTransport( TransporterFactory.engine ) );
      case TRANSPORTER.mandrill:
        TransporterFactory.engine = mandrillTransport({
          auth : {
            apiKey: args.apiKey
          }
        }) as unknown;
        return new MandrillTransporter( createTransport( TransporterFactory.engine ) );
      case TRANSPORTER.postmark:
        TransporterFactory.engine = PostmarkTransport.PostmarkTransport;
        return new PostmarkTransporter( createTransport( new TransporterFactory.engine({
          auth: { apiKey: args.apiKey }
        }) ) );
      case TRANSPORTER.sendgrid :
        TransporterFactory.engine = sendgridTransport({
          apiKey: args.apiKey
        }) as unknown;
        return new SendgridTransporter( createTransport( TransporterFactory.engine ) );
      case TRANSPORTER.sendinblue:
        TransporterFactory.engine = sendinblueTransport({
          apiKey: args.apiKey,
          apiUrl: 'https://api.sendinblue.com/v3/smtp'
        }) as unknown;
        return new SendinblueTransporter( createTransport( TransporterFactory.engine ) );
      case TRANSPORTER.smtp :
        TransporterFactory.engine = ((options) => {
          return createTransport( {
            host: options.host,
            port: options.port,
            secure: options.secure,
            auth: {
              user: options.username,
              pass: options.password
            },
            greetingTimeout: 5000,
            socketTimeout: 5000
          } ) as unknown;
        })(args.smtp)
        return new SmtpTransporter(TransporterFactory.engine)
      case TRANSPORTER.sparkpost :
        TransporterFactory.engine = sparkpostTransport({
          sparkPostApiKey: args.apiKey,
          options: {
            open_tracking: true,
            click_tracking: true,
            transactional: true
          }
        }) as unknown;
        return new SparkpostTransporter( createTransport( TransporterFactory.engine ) );
    }
  }
}