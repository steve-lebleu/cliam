import { Container } from '@services/container.service';
import { PROVIDER } from '@typings/provider.type';

/**
 * @description Applies sandbox mode overrides to the build() output when Container.configuration.sandbox is true.
 *
 * @param transporter Name of the transporter
 */
const Debug = (transporter: string) => {
  return <T extends (...args: any[]) => any>(value: T, _context: ClassMethodDecoratorContext): T => {
    return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
      const output = value.apply(this, args) as Record<string, unknown>;

      if (output && Container.configuration?.sandbox) {
        switch (transporter) {
          case PROVIDER.mailgun:
            Object.assign(output, { testmode: true });
            break;
          case PROVIDER.mailjet:
            Object.assign(output, {
              SandboxMode: true,
              mail_settings: { sandbox_mode: { enable: true } },
            });
            break;
          case PROVIDER.mailersend:
            output.to = ['John Doe test@blackhole.mailersend.com'];
            if (output.cc) output.cc = ['John Doe test@blackhole.mailersend.com'];
            if (output.bcc) output.bcc = ['John Doe test@blackhole.mailersend.com'];
            break;
          case PROVIDER.postmark:
            output.to = ['John Doe test@blackhole.postmarkapp.com'];
            if (output.cc) output.cc = ['John Doe test@blackhole.postmarkapp.com'];
            if (output.bcc) output.bcc = ['John Doe test@blackhole.postmarkapp.com'];
            break;
          case PROVIDER.sendgrid:
            Object.assign(output, { mail_settings: { sandbox_mode: { enable: true } } });
            break;
          case PROVIDER.brevo:
            Object.assign(output, { headers: { 'X-Sib-Sandbox': 'drop' } });
            break;
          case PROVIDER.sparkpost:
            Object.assign(output, { options: { sandbox: true } });
            break;
        }
      }

      return output as ReturnType<T>;
    } as unknown as T;
  };
};

export { Debug };
