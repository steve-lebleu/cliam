import { PROVIDER } from '@enums/provider.enum';
import { createTransport } from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid';
import { registerTransporter } from '../registry';
import { SendgridTransporter } from './sendgrid.class';

registerTransporter(PROVIDER.sendgrid, (vars, args) =>
  new SendgridTransporter(createTransport((sendgridTransport as any)({
    apiKey: args.auth.apiKey
  })), args)
);

export { SendgridTransporter };
