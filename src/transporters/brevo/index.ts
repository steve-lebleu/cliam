import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '@transporters/transporter.registry';
import { BrevoTransporter } from './brevo.class';

registerTransporter(PROVIDER.brevo, (_vars, args) =>
  new BrevoTransporter(
    new HttpClient({
      baseUrl: 'https://api.brevo.com/v3/',
      headers: {
        'api-key': args.auth.apiKey,
        'accept': 'application/json',
        'content-type': 'application/json',
      },
    }),
    args,
  )
);

export { BrevoTransporter };
