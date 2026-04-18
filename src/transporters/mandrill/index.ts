import { PROVIDER } from '@enums/provider.enum';
import { createTransport } from 'nodemailer';
import mandrillTransport from 'nodemailer-mandrill-transport';
import { registerTransporter } from '../registry';
import { MandrillTransporter } from './mandrill.class';

registerTransporter(PROVIDER.mandrill, (vars, args) =>
  new MandrillTransporter(createTransport((mandrillTransport as any)({
    auth: { apiKey: args.auth.apiKey }
  })), args)
);

export { MandrillTransporter };
