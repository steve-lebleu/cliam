import { PROVIDER } from '@enums/provider.enum';
import { MailerSend } from 'mailersend';
import { registerTransporter } from '../registry';
import { MailersendTransporter } from './mailersend.class';

registerTransporter(PROVIDER.mailersend, (vars, args) => {
  const engine = new MailerSend({ apiKey: args.auth.apiKey }) as any;
  engine.sendMail = (payload: any, callback: (err?: Error, result?: Record<string, unknown>) => void): Promise<void> =>
    engine.email.send(payload)
      .then((result: any) => callback(null, result))
      .catch((e: Error) => callback(e));
  return new MailersendTransporter(engine, args);
});

export { MailersendTransporter };
