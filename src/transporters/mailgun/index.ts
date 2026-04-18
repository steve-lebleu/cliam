import { createTransport } from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import { MailgunTransporter } from './mailgun.class';
import { registerTransporter } from '../registry';
import { PROVIDER } from '@enums/provider.enum';

registerTransporter(PROVIDER.mailgun, (vars, args) =>
  new MailgunTransporter(createTransport((mailgunTransport as any)({
    auth: {
      api_key: args.auth.apiKey,
      domain: vars.domain
    }
  })), args)
);

export { MailgunTransporter };
