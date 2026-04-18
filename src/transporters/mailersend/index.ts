import { MailerSend } from 'mailersend';
import { MailersendTransporter } from './mailersend.class';
import { registerTransporter } from '../registry';
import { PROVIDER } from '@enums/provider.enum';

registerTransporter(PROVIDER.mailersend, (vars, args) => {
  const engine = new MailerSend({ apiKey: args.auth.apiKey }) as any;
  engine.sendMail = (payload: any, callback: (err?: Error, result?: Record<string, unknown>) => void): Promise<void> =>
    engine.email.send(payload)
      .then((result: any) => callback(null, result))
      .catch((e: Error) => callback(e));
  return new MailersendTransporter(engine, args);
});

export { MailersendTransporter };
