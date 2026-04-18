import { PROVIDER } from '@enums/provider.enum';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '../registry';
import { SparkpostTransporter } from './sparkpost.class';

registerTransporter(PROVIDER.sparkpost, (vars, args) =>
  new SparkpostTransporter(
    new HttpClient({
      baseUrl: 'https://api.sparkpost.com/api/',
      headers: { 'Authorization': args.auth.apiKey },
    }),
    args,
  )
);

export { SparkpostTransporter };
