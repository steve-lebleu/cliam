import { createTransport } from 'nodemailer';
import { SmtpTransporter } from './smtp.class';
import { registerTransporter } from '../registry';

registerTransporter('smtp', (vars, args) =>
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
