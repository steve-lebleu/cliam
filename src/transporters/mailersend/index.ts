import { PROVIDER } from '@typings/provider.type';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '@transporters/transporter.registry';
import { MailersendTransporter } from './mailersend.class';

registerTransporter(PROVIDER.mailersend, (_vars, args) =>
  new MailersendTransporter(
    new HttpClient({
      baseUrl: 'https://api.mailersend.com/v1/',
      headers: {
        'Authorization': `Bearer ${args.auth.apiKey!}`,
        'Content-Type': 'application/json',
      },
    }),
    args,
  )
);

export { MailersendTransporter };
