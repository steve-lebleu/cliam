import { PROVIDER } from '@enums/provider.enum';
import { createTransport } from 'nodemailer';
import { PostmarkTransport } from 'nodemailer-postmark-transport';
import { registerTransporter } from '../registry';
import { PostmarkTransporter } from './postmark.class';

registerTransporter(PROVIDER.postmark, (vars, args) =>
  new PostmarkTransporter(createTransport(new PostmarkTransport({
    auth: { apiKey: args.auth.apiKey }
  })), args)
);

export { PostmarkTransporter };
