import { PROVIDER } from '@enums/provider.enum';
import { createTransport } from 'nodemailer';
import brevoTransport from 'nodemailer-brevo-transport';
import { registerTransporter } from '../registry';
import { BrevoTransporter } from './brevo.class';

registerTransporter(PROVIDER.brevo, (vars, args) =>
  new BrevoTransporter(createTransport(new (brevoTransport as any)({
    apiKey: args.auth.apiKey
  })), args)
);

export { BrevoTransporter };
