import { PROVIDER } from '@typings/provider.type';
import { HttpClient } from '@services/http.service';
import { registerTransporter } from '@transporters/transporter.registry';
import { SesTransporter } from './ses.class';

registerTransporter(PROVIDER.ses, (_vars, args) => {
  const region = args.options?.region ?? 'us-east-1';
  return new SesTransporter(
    new HttpClient({
      baseUrl: `https://email.${region}.amazonaws.com/`,
    }),
    args,
    region,
  );
});

export { SesTransporter };
