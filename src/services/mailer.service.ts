import { SendingResponse } from '@classes/sending-response.class';
import { SendingError } from '@classes/sending-error.class';
import { IPayload } from '@interfaces/IPayload.interface';
import { Transporter } from '@transporters/transporter.class';
import { Container } from '@services/container.service';
import { Compiler } from '@services/compiler.service';
import { COMPILER } from '@enums/compiler.enum';
import { IBuildable } from '@interfaces/IBuildable.interface';
import { IBuffer } from '@interfaces/IBuffer.interface';
import { BUFFER_MIME_TYPE } from '@enums/buffer-mime-type.enum';
import { mailSchema } from '@validations/mail.validation';

/**
 * @description Manage incoming mail requests
 */
class Mailer {

  /**
   * @description
   */
  private static instance: Mailer = null;

  /**
   * @description
   */
  private transporter: Transporter = null;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  /**
   * @description
   */
  static get(transporter: Transporter): Mailer {
    if(!Mailer.instance) {
      Mailer.instance = new Mailer( transporter );
    }
    return Mailer.instance;
  }

  /**
   * @description Send email
   */
  send = async (event: string, payload: IPayload): Promise<SendingResponse|SendingError> => {
    this.setCompiler(event, payload);
    this.setAddresses(payload);
    const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
    if (error) {
      return new SendingError(400, 'Validation error', [ error.details.shift().message ]);
    }
    return await this.transporter.send( this.transporter.build( this.getBuildable(event, payload) ) )
  }

  /**
   * @description
   *
   * @param event
   * @param payload
   */
  private setAddresses(payload: IPayload): void {
    payload.meta.from = !payload.meta.from ? Container.configuration.consumer?.addresses?.from : payload.meta.from;
    payload.meta.replyTo = !payload.meta.replyTo ? Container.configuration.consumer?.addresses?.reply : payload.meta.replyTo;
  }

  /**
   * @description
   *
   * @param event
   * @param payload
   */
   private setCompiler(event: string, payload: IPayload): void {
    payload.compiler = payload.compiler ? payload.compiler : payload.content ? COMPILER.self : this.getTemplateId(event) ? COMPILER.provider : COMPILER.default;
  }

  /**
   * @description
   *
   * @param event
   * @param payload
   */
  private getBuildable(event: string, payload: IPayload): IBuildable {
    return {
      payload,
      templateId: payload.compiler === COMPILER.provider ? this.getTemplateId(event) : null,
      body: [ COMPILER.self, COMPILER.default ].includes(payload.compiler as COMPILER) ? this.getCompilated(event, payload) : null,
      origin: this.getOrigin()
    }
  }

  /**
   * @description
   */
  private getOrigin(): string {
    return Container.configuration.consumer.domain;
  }

  /**
   * @description
   */
  private getTemplateId(event: string): string {
    return Container.configuration.mode?.api?.templates[event] as string;
  }

  /**
   * @description
   */
  private hasPlainText(content: IBuffer[]): boolean {
    return content.some( (buffer: IBuffer) => buffer.type === BUFFER_MIME_TYPE['text/plain'] && buffer.value );
  }

  /**
   * @description
   */
  private getCompilated(event: string, payload: IPayload): { html: string, text: string } {

    if (payload.compiler === COMPILER.self && this.hasPlainText(payload.content)) {
      return {
        html: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value,
        text: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/plain']).value,
      }
    }

    if (payload.compiler === COMPILER.self && !this.hasPlainText(payload.content)) {
      return {
        html: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value,
        text: Compiler.textify(payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value),
      }
    }

    return Compiler.compile(event, Object.assign({ subject: payload.meta.subject }, payload.data));
  }

}

const service = Mailer.get( Container.transporter );

export { service as Mailer }

