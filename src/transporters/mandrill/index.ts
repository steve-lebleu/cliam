import { createTransport } from 'nodemailer';
import mandrillTransport from 'nodemailer-mandrill-transport';
import { MandrillTransporter } from './mandrill.class';
import { registerTransporter } from '../registry';
import { PROVIDER } from '@enums/provider.enum';

registerTransporter(PROVIDER.mandrill, (vars, args) =>
  new MandrillTransporter(createTransport((mandrillTransport as any)({
    auth: { apiKey: args.auth.apiKey }
  })), args)
);

export { MandrillTransporter };
