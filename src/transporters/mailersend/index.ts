import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '../transporter.registry';
import { MailersendTransporter } from './mailersend.class';

registerTransporter(PROVIDER.mailersend, (vars, args) =>
  new MailersendTransporter(
    new HttpClient({
      baseUrl: 'https://api.mailersend.com/v1/',
      headers: {
        'Authorization': `Bearer ${args.auth.apiKey}`,
        'Content-Type': 'application/json',
      },
    }),
    args,
  )
);

export { MailersendTransporter };
