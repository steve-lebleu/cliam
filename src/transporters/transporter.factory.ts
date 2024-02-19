import * as sparkpostTransport from 'nodemailer-sparkpost-transport';
import * as mailgunTransport from 'nodemailer-mailgun-transport';
import * as mandrillTransport from 'nodemailer-mandrill-transport';
import * as PostmarkTransport from 'nodemailer-postmark-transport';
import * as sendgridTransport from 'nodemailer-sendgrid';
import * as mailjetTransport from 'node-mailjet';
import { MailerSend } from 'mailersend';
import * as brevoTransport from 'nodemailer-brevo-transport';
import * as sendinblueTransport from 'nodemailer-sendinblue-v3-transport';

import { createTransport } from 'nodemailer';

import { PROVIDER } from '../types/enums/provider.enum';
import { MODE } from '../types/enums/mode.enum';
import { IAddressable } from '../types/interfaces/addresses/IAddressable.interface';

import { Transporter } from './transporter.class';
import { SmtpTransporter } from './smtp/smtp.class';
import { SparkpostTransporter } from './sparkpost/sparkpost.class';
import { SendgridTransporter } from './sendgrid/sendgrid.class';
import { BrevoTransporter } from './brevo/brevo.class';
import { MailersendTransporter } from './mailersend/mailersend.class';
import { MandrillTransporter } from './mandrill/mandrill.class';
import { MailgunTransporter } from './mailgun/mailgun.class';
import { MailjetTransporter } from './mailjet/mailjet.class';
import { PostmarkTransporter } from './postmark/postmark.class';
import { SendinblueTransporter } from './sendinblue/sendinblue.class';
import { ITransporterDefinition } from '../types/interfaces/ITransporter.interface';

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
  static get({...vars}: { domain: string, addresses: { from: IAddressable, replyTo: IAddressable } }, { ...args }: ITransporterDefinition): Transporter {
    if(args.mode === MODE.smtp) {
      return new SmtpTransporter(createTransport( {
        host: args.options.host,
        port: args.options.port,
        secure: args.options.secure,
        auth: {
          user: args.auth.username,
          pass: args.auth.password
        },
        greetingTimeout: 5000,
        socketTimeout: 5000
      } ))
    }

    switch(args.provider) {

      case PROVIDER.brevo:

        TransporterFactory.engine = brevoTransport;
        return new BrevoTransporter( createTransport( new TransporterFactory.engine({
          apiKey: args.auth.apiKey
        }) ) );

      case PROVIDER.mailersend:
        
        let mailersendEngine = new MailerSend({
          apiKey: args.auth.apiKey
        });

        mailersendEngine['sendMail'] = async (payload: any, callback: (err?: Error, result?: Record<string,unknown>) => void): Promise<void> => {
          return mailersendEngine.email.send(payload)
            .then((result) => {
              callback(null, result as any)
            })
            .catch((e) => {
              callback(e);
            })
        }

        return new MailersendTransporter( mailersendEngine as any );

      case PROVIDER.mailgun:
        
        return new MailgunTransporter( createTransport( mailgunTransport({
          auth: {
            api_key: args.auth.apiKey,
            domain: vars.domain
          }
        }) ) );

      case PROVIDER.mailjet:

        let mailjetEngine = mailjetTransport.Client.apiConnect(args.auth.apiKey, args.auth.apiSecret);
        let engine = {
          sendMail: async (payload: any, callback: (err?: Error, result?: Record<string,unknown>) => void): Promise<void> => {
            return mailjetEngine
              .post('send', { version : 'v3.1' })
              .request(payload)
              .then( (result: any) => {
                callback(null, result);
              })
              .catch( (error: any) => {
                callback(error, null);
              });
          }
        }

        return new MailjetTransporter( engine );

      case PROVIDER.mandrill:

        return new MandrillTransporter( createTransport( mandrillTransport({
          auth : {
            apiKey: args.auth.apiKey
          }
        }) ) );

      case PROVIDER.postmark:
        TransporterFactory.engine = PostmarkTransport.PostmarkTransport;
        return new PostmarkTransporter( createTransport( new TransporterFactory.engine({
          auth: { apiKey: args.auth.apiKey }
        }) ) );

      case PROVIDER.sendgrid :

        return new SendgridTransporter( createTransport( sendgridTransport({
          apiKey: args.auth.apiKey
        }) ) );
      
      case PROVIDER.sendinblue :

        TransporterFactory.engine = sendinblueTransport({
          apiKey: args.auth.apiKey,
          apiUrl: 'https://api.sendinblue.com/v3/smtp'
        });
        return new SendinblueTransporter( createTransport( TransporterFactory.engine ) );

      case PROVIDER.sparkpost :

        return new SparkpostTransporter( createTransport( sparkpostTransport({
          sparkPostApiKey: args.auth.apiKey,
          options: {
            open_tracking: true,
            click_tracking: true,
            transactional: true
          }
        }) ) );
    }
  }
}