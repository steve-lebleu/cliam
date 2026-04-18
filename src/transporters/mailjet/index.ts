import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '@transporters/transporter.registry';
import { MailjetTransporter } from './mailjet.class';

registerTransporter(PROVIDER.mailjet, (_vars, args) => {
  const credentials = btoa(`${args.auth.apiKey}:${args.auth.apiSecret}`);

  return new MailjetTransporter(
    new HttpClient({
      baseUrl: 'https://api.mailjet.com/',
      headers: { 'Authorization': `Basic ${credentials}` },
    }),
    args,
  );
});

export { MailjetTransporter };
