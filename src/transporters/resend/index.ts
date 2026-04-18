import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '@transporters/transporter.registry';
import { ResendTransporter } from './resend.class';

registerTransporter(PROVIDER.resend, (_vars, args) =>
  new ResendTransporter(
    new HttpClient({
      baseUrl: 'https://api.resend.com/',
      headers: {
        'Authorization': `Bearer ${args.auth.apiKey!}`,
        'Content-Type': 'application/json',
      },
    }),
    args,
  )
);

export { ResendTransporter };
