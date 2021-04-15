import { Container } from '@services/container.service';
import { TRANSPORTER } from '@enums/transporter.enum';

/**
 * @description
 *
 * @param transporter
 */
const Debug = ( transporter: string ): any => {
  return ( target: Record<string,({...args}: any)=>any>, key: string ) => {
    const method = target[key] as ({...args}: any) => any;
    target[key] = function (...args: any[]): any {
      const output = method.apply(this, args) as { Message?: {From: { Email: string, Name: string}}, Messages?: Array<{From: { Email: string, Name: string}}>, from?: string, to?: Array<string>, cc?: Array<string>, bcc?: Array<string>, html?: string, text?: string };
      if (output) {
        if (Container.configuration?.sandbox?.active) {
          switch(transporter) {
            case TRANSPORTER.mailjet:
              Object.assign(output, {
                SandboxMode: true,
                mail_settings: {
                  sandbox_mode: {
                    enable: true
                  }
                }
              });
              output.Messages[0].From = { Email: Container.configuration.sandbox.from.email, Name: Container.configuration.sandbox.from.name };
              break;
            case TRANSPORTER.sendgrid:
              Object.assign(output, {
                mail_settings: {
                  sandbox_mode: {
                    enable: true
                  }
                }
              });
              break;
            case TRANSPORTER.postmark:
              output.from = `${Container.configuration.sandbox.from.name} ${Container.configuration.sandbox.from.email}`;
              output.to = [].concat(output.to).map( (recipient) => {
                return `${Container.configuration.sandbox.to.name} ${Container.configuration.sandbox.to.email}`;
              });
              if(output.cc) {
                output.cc = [].concat(output.cc).map( (recipient) => {
                  return `${Container.configuration.sandbox.to.name} ${Container.configuration.sandbox.to.email}`;
                });
              }
              if(output.bcc) {
                output.bcc = [].concat(output.bcc).map( (recipient) => {
                  return `${Container.configuration.sandbox.to.name} ${Container.configuration.sandbox.to.email}`;
                });
              }
              break;
          }
        }
        return output;
      }
    }
    return target[key] as ({...args}) => any;
  }
}

export { Debug }



