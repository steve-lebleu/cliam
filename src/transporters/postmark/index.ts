import { createTransport } from 'nodemailer';
import { PostmarkTransport } from 'nodemailer-postmark-transport';
import { PostmarkTransporter } from './postmark.class';
import { registerTransporter } from '../registry';
import { PROVIDER } from '@enums/provider.enum';

registerTransporter(PROVIDER.postmark, (vars, args) =>
  new PostmarkTransporter(createTransport(new PostmarkTransport({
    auth: { apiKey: args.auth.apiKey }
  })), args)
);

export { PostmarkTransporter };
