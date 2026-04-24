import { PROVIDER } from '@typings/provider.type';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '../transporter.registry';
import { SparkpostTransporter } from './sparkpost.class';

registerTransporter(PROVIDER.sparkpost, (_vars, args) =>
  new SparkpostTransporter(
    new HttpClient({
      baseUrl: 'https://api.sparkpost.com/api/',
      headers: { 'Authorization': args.auth.apiKey! },
    }),
    args,
  )
);

export { SparkpostTransporter };
