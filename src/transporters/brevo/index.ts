import { createTransport } from 'nodemailer';
import brevoTransport from 'nodemailer-brevo-transport';
import { BrevoTransporter } from './brevo.class';
import { registerTransporter } from '../registry';
import { PROVIDER } from '@enums/provider.enum';

registerTransporter(PROVIDER.brevo, (vars, args) =>
  new BrevoTransporter(createTransport(new (brevoTransport as any)({
    apiKey: args.auth.apiKey
  })), args)
);

export { BrevoTransporter };
