import { createTransport } from 'nodemailer';

import { Transporter } from './transporter.class';
import { ITransporterConfiguration } from './ITransporterConfiguration.interface';
import { PROVIDER } from '@/types/enums/provider.enum';
import { IAddressable } from '@/types/interfaces/addresses/IAddressable.interface';

import { SmtpTransporter } from './smtp/smtp.class';

import brevoTransport from 'nodemailer-brevo-transport';
import { BrevoTransporter } from './brevo/brevo.class';

import { MailerSend } from 'mailersend';
import { MailersendTransporter } from './mailersend/mailersend.class';

import mailgunTransport from 'nodemailer-mailgun-transport';
import { MailgunTransporter } from './mailgun/mailgun.class';

import mailjetTransport from 'node-mailjet';
import { MailjetTransporter } from './mailjet/mailjet.class';

import mandrillTransport from 'nodemailer-mandrill-transport';
import { MandrillTransporter } from './mandrill/mandrill.class';

import { PostmarkTransport } from 'nodemailer-postmark-transport';
import { PostmarkTransporter } from './postmark/postmark.class';

import sendgridTransport from 'nodemailer-sendgrid';
import { SendgridTransporter } from './sendgrid/sendgrid.class';

import sendinblueTransport from 'nodemailer-sendinblue-v3-transport';
import { SendinblueTransporter } from './sendinblue/sendinblue.class';

import sparkpostTransport from 'nodemailer-sparkpost-transport';
import { SparkpostTransporter } from './sparkpost/sparkpost.class';

export class TransporterFactory {

  private constructor() {}

  static get({ ...vars }: { domain: string, addresses: { from: IAddressable, replyTo: IAddressable } }, { ...args }: ITransporterConfiguration): Transporter {

    if (!args.provider) {
      return new SmtpTransporter(createTransport({
        host: args.options.host,
        port: args.options.port,
        secure: args.options.secure,
        auth: {
          user: args.auth.username,
          pass: args.auth.password
        },
        greetingTimeout: 5000,
        socketTimeout: 5000
      }), args);
    }

    switch (args.provider) {

      case PROVIDER.brevo:
        return new BrevoTransporter(createTransport(new (brevoTransport as any)({
          apiKey: args.auth.apiKey
        })), args);

      case PROVIDER.mailersend: {
        const engine = new MailerSend({ apiKey: args.auth.apiKey }) as any;
        engine.sendMail = (payload: any, callback: (err?: Error, result?: Record<string, unknown>) => void): Promise<void> => {
          return engine.email.send(payload)
            .then((result: any) => callback(null, result))
            .catch((e: Error) => callback(e));
        };
        return new MailersendTransporter(engine, args);
      }

      case PROVIDER.mailgun:
        return new MailgunTransporter(createTransport((mailgunTransport as any)({
          auth: {
            api_key: args.auth.apiKey,
            domain: vars.domain
          }
        })), args);

      case PROVIDER.mailjet: {
        const client = (mailjetTransport as any).Client.apiConnect(args.auth.apiKey, args.auth.apiSecret);
        const engine = {
          sendMail: (payload: any, callback: (err?: Error, result?: Record<string, unknown>) => void): Promise<void> => {
            return client.post('send', { version: 'v3.1' })
              .request(payload)
              .then((result: any) => callback(null, result))
              .catch((error: any) => callback(error, null));
          }
        };
        return new MailjetTransporter(engine, args);
      }

      case PROVIDER.mandrill:
        return new MandrillTransporter(createTransport((mandrillTransport as any)({
          auth: { apiKey: args.auth.apiKey }
        })), args);

      case PROVIDER.postmark:
        return new PostmarkTransporter(createTransport(new PostmarkTransport({
          auth: { apiKey: args.auth.apiKey }
        })), args);

      case PROVIDER.sendgrid:
        return new SendgridTransporter(createTransport((sendgridTransport as any)({
          apiKey: args.auth.apiKey
        })), args);

      case PROVIDER.sendinblue:
        return new SendinblueTransporter(createTransport((sendinblueTransport as any)({
          apiKey: args.auth.apiKey,
          apiUrl: 'https://api.sendinblue.com/v3/smtp'
        })), args);

      case PROVIDER.sparkpost:
        return new SparkpostTransporter(createTransport((sparkpostTransport as any)({
          sparkPostApiKey: args.auth.apiKey,
          options: {
            open_tracking: true,
            click_tracking: true,
            transactional: true
          }
        })), args);
    }
  }
}
