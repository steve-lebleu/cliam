import { createTransport } from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid';
import { SendgridTransporter } from './sendgrid.class';
import { registerTransporter } from '../registry';
import { PROVIDER } from '@enums/provider.enum';

registerTransporter(PROVIDER.sendgrid, (vars, args) =>
  new SendgridTransporter(createTransport((sendgridTransport as any)({
    apiKey: args.auth.apiKey
  })), args)
);

export { SendgridTransporter };
