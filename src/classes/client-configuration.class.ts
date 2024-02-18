import { Smtp } from './smtp.class';
import { Consumer } from './consumer.class';

import { Transporter } from './../types/types/transporter.type';

/**
 * @description
 */
class ClientConfiguration {

  sandbox?: boolean

  consumer: Consumer

  mode: {
    api?: {
      credentials: {
        apiKey: string,
        token?: string
      },
      name: Transporter,
      templates: Array<{[event: string]: string}>
    }
    smtp?: Smtp
  }

  constructor(payload: Record<string,unknown>) {
    Object.assign(this, payload);
  }
}

export { ClientConfiguration }