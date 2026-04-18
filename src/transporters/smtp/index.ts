import { createTransport } from 'nodemailer';
import { registerTransporter } from '@transporters/transporter.registry';
import { SmtpTransporter } from './smtp.class';

registerTransporter('smtp', (_vars, args) =>
  new SmtpTransporter(createTransport({
    host: args.options.host,
    port: args.options.port,
    secure: args.options.secure,
    auth: {
      user: args.auth.username,
      pass: args.auth.password
    },
    greetingTimeout: 5000,
    socketTimeout: 5000
  }), args)
);

export { SmtpTransporter };
