import { PROVIDER } from '@typings/provider.type';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '@transporters/transporter.registry';
import { MailjetTransporter } from './mailjet.class';

registerTransporter(PROVIDER.mailjet, (_vars, args) => {
  const credentials = Buffer.from(`${args.auth.apiKey?.trim()}:${args.auth.apiSecret?.trim()}`).toString('base64');

  return new MailjetTransporter(
    new HttpClient({
      baseUrl: 'https://api.mailjet.com/',
      headers: { 'Authorization': `Basic ${credentials}` },
    }),
    args,
  );
});

export { MailjetTransporter };
