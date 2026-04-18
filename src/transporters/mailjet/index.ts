import mailjetTransport from 'node-mailjet';
import { MailjetTransporter } from './mailjet.class';
import { registerTransporter } from '../registry';
import { PROVIDER } from '@enums/provider.enum';

registerTransporter(PROVIDER.mailjet, (vars, args) => {
  const client = (mailjetTransport as any).Client.apiConnect(args.auth.apiKey, args.auth.apiSecret);
  const engine = {
    sendMail: (payload: any, callback: (err?: Error, result?: Record<string, unknown>) => void): Promise<void> =>
      client.post('send', { version: 'v3.1' })
        .request(payload)
        .then((result: any) => callback(null, result))
        .catch((error: any) => callback(error, null))
  };
  return new MailjetTransporter(engine, args);
});

export { MailjetTransporter };
