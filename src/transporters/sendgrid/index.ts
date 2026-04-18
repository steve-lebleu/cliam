import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '@transporters/transporter.registry';
import { SendgridTransporter } from './sendgrid.class';

registerTransporter(PROVIDER.sendgrid, (_vars, args) =>
  new SendgridTransporter(
    new HttpClient({
      baseUrl: 'https://api.sendgrid.com/',
      headers: { 'Authorization': `Bearer ${args.auth.apiKey!}` },
    }),
    args,
  )
);

export { SendgridTransporter };
