import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '../transporter.registry';
import { MandrillTransporter } from './mandrill.class';

registerTransporter(PROVIDER.mandrill, (vars, args) =>
  new MandrillTransporter(
    new HttpClient({
      baseUrl: 'https://mandrillapp.com/api/1.0/',
      headers: { 'Content-Type': 'application/json' },
    }),
    args,
  )
);

export { MandrillTransporter };
