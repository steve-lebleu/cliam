import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '../registry';
import { SendgridTransporter } from './sendgrid.class';

registerTransporter(PROVIDER.sendgrid, (vars, args) =>
  new SendgridTransporter(
    new HttpClient({
      baseUrl: 'https://api.sendgrid.com/',
      headers: { 'Authorization': `Bearer ${args.auth.apiKey}` },
    }),
    args,
  )
);

export { SendgridTransporter };
