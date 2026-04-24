import { PROVIDER } from '@typings/provider.type';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '../transporter.registry';
import { MailgunTransporter } from './mailgun.class';

registerTransporter(PROVIDER.mailgun, (_vars, args) => {
  const credentials = btoa(`api:${args.auth.apiKey!}`);
  const { domain } = args.options;

  return new MailgunTransporter(
    new HttpClient({
      baseUrl: `https://api.mailgun.net/v3/${domain}/`,
      headers: { 'Authorization': `Basic ${credentials}` },
    }),
    args,
  );
});

export { MailgunTransporter };
