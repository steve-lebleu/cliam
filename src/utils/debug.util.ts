import { Container } from '@services/container.service';
import { type Provider, PROVIDER } from '@typings/provider.type';

/**
 * @description Applies sandbox mode overrides to the build() output when Container.configuration.sandbox is true.
 *
 * @param provider Name of the provider
 */
const Debug = (provider: Provider) => {
  return <T extends (...args: any[]) => any>(value: T, _context: ClassMethodDecoratorContext): T => {
    return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
      const output = value.apply(this, args) as Record<string, unknown>;

      if (output && Container.configuration?.sandbox) {
        switch (provider) {
          case PROVIDER.brevo:
            Object.assign(output, { headers: { 'X-Sib-Sandbox': 'drop' } });
            break;
          case PROVIDER.mailgun:
            Object.assign(output, { 'o:testmode': 'yes' });
            break;
          case PROVIDER.mailjet:
            Object.assign(output, {
              SandboxMode: true,
              mail_settings: { sandbox_mode: { enable: true } },
            });
            break;
          case PROVIDER.mailersend:
            output.to = [{ email: 'test@blackhole.mailersend.com', name: 'John Doe' }];
            if (output.cc) output.cc = [{ email: 'test@blackhole.mailersend.com', name: 'John Doe' }];
            if (output.bcc) output.bcc = [{ email: 'test@blackhole.mailersend.com', name: 'John Doe' }];
            break;
          case PROVIDER.postmark:
            output.to = 'John Doe test@blackhole.postmarkapp.com';
            if (output.cc) output.cc = 'John Doe test@blackhole.postmarkapp.com';
            if (output.bcc) output.bcc = 'John Doe test@blackhole.postmarkapp.com';
            break;
          case PROVIDER.sendgrid:
            Object.assign(output, { mail_settings: { sandbox_mode: { enable: true } } });
            break;
          case PROVIDER.sparkpost:
            Object.assign(output, { options: { sandbox: true } });
            break;
          case PROVIDER.mandrill: {
            const message = output.message as Record<string, unknown>;
            message.to = [{ email: 'test@blackhole.mailchimp.com', name: 'Test', type: 'to' }];
            break;
          }
          case PROVIDER.resend:
            output.to = ['delivered@resend.dev'];
            delete output.cc;
            delete output.bcc;
            break;
          case PROVIDER.ses:
            output.Destination = { ToAddresses: ['success@simulator.amazonses.com'] };
            break;
        }
      }

      return output as ReturnType<T>;
    } as unknown as T;
  };
};

export { Debug };
