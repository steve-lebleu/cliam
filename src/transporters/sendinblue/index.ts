import { PROVIDER } from '@enums/provider.enum';
import { createTransport } from 'nodemailer';
import sendinblueTransport from 'nodemailer-sendinblue-v3-transport';
import { registerTransporter } from '../registry';
import { SendinblueTransporter } from './sendinblue.class';

registerTransporter(PROVIDER.sendinblue, (vars, args) =>
  new SendinblueTransporter(createTransport((sendinblueTransport as any)({
    apiKey: args.auth.apiKey,
    apiUrl: 'https://api.sendinblue.com/v3/smtp'
  })), args)
);

export { SendinblueTransporter };
