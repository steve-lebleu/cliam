import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { Transporter } from './../transporters/transporter.class';
import { Container } from './../services/container.service';
import { RenderEngine } from './render-engine.service';
import { RENDER_ENGINE } from '../types/enums/render-engine.enum';
import { IBuildable } from './../types/interfaces/IBuildable.interface';
import { IBuffer } from './../types/interfaces/IBuffer.interface';
import { BUFFER_MIME_TYPE } from './../types/enums/buffer-mime-type.enum';
import { mailSchema } from './../validations/mail.validation';
import { ITransporterDefinition } from '../types/interfaces/ITransporter.interface';
import { MODE } from '../types/enums/mode.enum';

/**
 * @description Manage incoming mail requests
 */
class Mailer {

  /**
   * @description
   */
  configuration: ITransporterDefinition = null;

  /**
   * @description
   */
  transporter: Transporter = null;

  constructor(transporter: Transporter, configuration: ITransporterDefinition) {
    this.transporter = transporter;
    this.configuration = configuration;
  }

  /**
   * @description Send email
   */
  send = async (event: string, payload: IPayload): Promise<SendingResponse|SendingError> => {
    this.setRenderEngine(event, payload);
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
    payload.meta.from = !payload.meta.from ? Container.configuration.variables.addresses.from : payload.meta.from;
    payload.meta.replyTo = !payload.meta.replyTo ? Container.configuration.variables.addresses.replyTo : payload.meta.replyTo;
  }

  /**
   * @description
   *
   * @param event
   * @param payload
   */
   private setRenderEngine(event: string, payload: IPayload): void {
    if (this.configuration.mode === MODE.smtp) {
      payload.renderEngine = payload.content ? RENDER_ENGINE.self : RENDER_ENGINE.default;
    }
    if (this.configuration.mode === MODE.api) {
      payload.renderEngine =  this.getTemplateId(event) ? RENDER_ENGINE.provider : payload.content ? RENDER_ENGINE.self : RENDER_ENGINE.default;
    }
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
      templateId: payload.renderEngine === RENDER_ENGINE.provider ? this.getTemplateId(event) : null,
      body: [ RENDER_ENGINE.self, RENDER_ENGINE.default ].includes(payload.renderEngine as RENDER_ENGINE) ? this.getCompilated(event, payload) : null,
      origin: this.getOrigin()
    }
  }

  /**
   * @description
   */
  private getOrigin(): string {
    return Container.configuration.variables.domain;
  }

  /**
   * @description
   */
  private getTemplateId(event: string): string {
    return this.configuration.options.templates[event] as string;
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

    if (payload.renderEngine === RENDER_ENGINE.self && this.hasPlainText(payload.content)) {
      return {
        html: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value,
        text: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/plain']).value,
      }
    }

    if (payload.renderEngine === RENDER_ENGINE.self && !this.hasPlainText(payload.content)) {
      return {
        html: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value,
        text: RenderEngine.textify(payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value),
      }
    }

    return RenderEngine.compile(event, Object.assign({ subject: payload.meta.subject }, payload.data));
  }

}

export { Mailer }

