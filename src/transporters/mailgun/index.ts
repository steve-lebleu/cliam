import { PROVIDER } from '@enums/provider.enum';
import { createTransport } from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import { registerTransporter } from '../registry';
import { MailgunTransporter } from './mailgun.class';

registerTransporter(PROVIDER.mailgun, (vars, args) =>
  new MailgunTransporter(createTransport((mailgunTransport as any)({
    auth: {
      api_key: args.auth.apiKey,
      domain: vars.domain
    }
  })), args)
);

export { MailgunTransporter };
