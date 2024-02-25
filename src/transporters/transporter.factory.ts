import { createTransport } from 'nodemailer';

import { Transporter } from './transporter.class';
import { ITransporterConfiguration } from './ITransporterConfiguration.interface';

import { PROVIDER } from '../types/enums/provider.enum';
import { IAddressable } from '../types/interfaces/addresses/IAddressable.interface';

/**
 * @description
 */
export class TransporterFactory {

  private static engine = null;

  private constructor() {}

  /**
   * @description Get a concrete transporter instance
   *
   * @param vars
   * @param args
   */
  static get({...vars}: { domain: string, addresses: { from: IAddressable, replyTo: IAddressable } }, { ...args }: ITransporterConfiguration): Transporter {
    
    if(!args.provider) {
      const { SmtpTransporter } = require('./smtp/smtp.class');
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
      } ), args)
    }

    switch(args.provider) {

      case PROVIDER.brevo:

        const brevoTransport = require('nodemailer-brevo-transport');
        const { BrevoTransporter } = require('./brevo/brevo.class');

        TransporterFactory.engine = brevoTransport;
        return new BrevoTransporter( createTransport( new TransporterFactory.engine({
          apiKey: args.auth.apiKey
        }) ), args );

      case PROVIDER.mailersend:
        
        const { MailerSend } = require('mailersend');
        const { MailersendTransporter } = require('./mailersend/mailersend.class');

        let mailersendEngine = new MailerSend({
          apiKey: args.auth.apiKey
        });

        mailersendEngine['sendMail'] = (payload: any, callback: (err?: Error, result?: Record<string,unknown>) => void): Promise<void> => {
          return mailersendEngine.email.send(payload)
            .then((result) => {
              callback(null, result as any)
            })
            .catch((e) => {
              callback(e);
            })
        }

        return new MailersendTransporter( mailersendEngine as any, args );

      case PROVIDER.mailgun:
        
        const mailgunTransport = require('nodemailer-mailgun-transport');
        const { MailgunTransporter } = require('./mailgun/mailgun.class');

        return new MailgunTransporter( createTransport( mailgunTransport({
          auth: {
            api_key: args.auth.apiKey,
            domain: vars.domain
          }
        }) ), args );

      case PROVIDER.mailjet:

        const mailjetTransport = require('node-mailjet');
        const { MailjetTransporter } = require('./mailjet/mailjet.class');

        let mailjetEngine = mailjetTransport.Client.apiConnect(args.auth.apiKey, args.auth.apiSecret);
        let engine = {
          sendMail: (payload: any, callback: (err?: Error, result?: Record<string,unknown>) => void): Promise<void> => {
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

        return new MailjetTransporter( engine, args );

      case PROVIDER.mandrill:
        
        const mandrillTransport = require('nodemailer-mandrill-transport');
        const { MandrillTransporter } = require('./mandrill/mandrill.class');

        return new MandrillTransporter( createTransport( mandrillTransport({
          auth : {
            apiKey: args.auth.apiKey
          }
        }) ), args );

      case PROVIDER.postmark:

        const PostmarkTransport = require('nodemailer-postmark-transport');
        const { PostmarkTransporter } = require('./postmark/postmark.class');

        TransporterFactory.engine = PostmarkTransport.PostmarkTransport;
        return new PostmarkTransporter( createTransport( new TransporterFactory.engine({
          auth: { apiKey: args.auth.apiKey }
        }) ), args );

      case PROVIDER.sendgrid :

        const sendgridTransport = require('nodemailer-sendgrid');
        const { SendgridTransporter } = require('./sendgrid/sendgrid.class');

        return new SendgridTransporter( createTransport( sendgridTransport({
          apiKey: args.auth.apiKey
        }) ), args );
      
      case PROVIDER.sendinblue :

        const sendinblueTransport = require('nodemailer-sendinblue-v3-transport');
        const { SendinblueTransporter } = require('./sendinblue/sendinblue.class');
        
        TransporterFactory.engine = sendinblueTransport({
          apiKey: args.auth.apiKey,
          apiUrl: 'https://api.sendinblue.com/v3/smtp'
        });
        return new SendinblueTransporter( createTransport( TransporterFactory.engine ), args );

      case PROVIDER.sparkpost :

        const sparkpostTransport = require('nodemailer-sparkpost-transport');
        const { SparkpostTransporter } = require('./sparkpost/sparkpost.class');

        return new SparkpostTransporter( createTransport( sparkpostTransport({
          sparkPostApiKey: args.auth.apiKey,
          options: {
            open_tracking: true,
            click_tracking: true,
            transactional: true
          }
        }) ), args );
    }
  }
}