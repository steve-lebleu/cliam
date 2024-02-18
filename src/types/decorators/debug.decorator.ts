import { Container } from './../../services/container.service';
import { TRANSPORTER } from './../enums/transporter.enum';

/**
 * @description
 *
 * @param transporter
 */
const Debug = ( transporter: string ): any => {
  return ( target: Record<string,({...args}: any)=>any>, key: string ) => {
    const method = target[key] as ({...args}: any) => any;
    target[key] = function (...args: any[]): any {
      const output = method.apply(this, args) as {
        Message?: {
          From: {
            Email: string,
            Name: string
          }
        },
        Messages?: Array<{From: { Email: string, Name: string}}>,
        from?: string,
        to?: Array<string>,
        cc?: Array<string>,
        bcc?: Array<string>,
        html?: string,
        text?: string,
        options?: { sandbox: boolean },
        content?: {
          from?: string
        }
      };
      if (output) {
        if (Container.configuration?.sandbox) {
          switch(transporter) {
            case TRANSPORTER.mailgun:
              Object.assign(output, { testmode: true })
              break;
            case TRANSPORTER.mailjet:
              Object.assign(output, {
                SandboxMode: true,
                mail_settings: {
                  sandbox_mode: {
                    enable: true
                  }
                }
              });
              break;
            case TRANSPORTER.postmark:
              output.to = [].concat(output.to).map( (recipient) => {
                return `John Doe test@blackhole.postmarkapp.com`;
              });
              if(output.cc) {
                output.cc = [].concat(output.cc).map( (recipient) => {
                  return `John Doe test@blackhole.postmarkapp.com`;
                });
              }
              if(output.bcc) {
                output.bcc = [].concat(output.bcc).map( (recipient) => {
                  return `John Doe test@blackhole.postmarkapp.com`;
                });
              }
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
            case TRANSPORTER.sendinblue:
              Object.assign(output, {
                headers: {
                  'X-Sib-Sandbox': 'drop'
                }
              });
              break;
            case TRANSPORTER.sparkpost:
              Object.assign(output, {
                options: {
                  sandbox: true
                },             
              });
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