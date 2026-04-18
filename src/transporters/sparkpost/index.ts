import { PROVIDER } from '@enums/provider.enum';
import { createTransport } from 'nodemailer';
import sparkpostTransport from 'nodemailer-sparkpost-transport';
import { registerTransporter } from '../registry';
import { SparkpostTransporter } from './sparkpost.class';

registerTransporter(PROVIDER.sparkpost, (vars, args) =>
  new SparkpostTransporter(createTransport((sparkpostTransport as any)({
    sparkPostApiKey: args.auth.apiKey,
    options: {
      open_tracking: true,
      click_tracking: true,
      transactional: true
    }
  })), args)
);

export { SparkpostTransporter };
