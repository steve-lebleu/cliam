require('module-alias/register');

import { Smtp } from '@classes/smtp.class';
import { Consumer } from '@classes/consumer.class';

import { Transporter } from '@ctypes/transporter.type';

/**
 * @description
 */
class ClientConfiguration {

  sandbox?: {
    active: boolean
    from: {
      name: string
      email: string
    },
    to: {
      name: string
      email: string
    }
  }

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