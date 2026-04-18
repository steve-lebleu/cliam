import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '../transporter.registry';
import { PostmarkTransporter } from './postmark.class';

registerTransporter(PROVIDER.postmark, (vars, args) =>
  new PostmarkTransporter(
    new HttpClient({
      baseUrl: 'https://api.postmarkapp.com/',
      headers: {
        'X-Postmark-Server-Token': args.auth.apiKey,
        'Content-Type': 'application/json',
      },
    }),
    args,
  )
);

export { PostmarkTransporter };
