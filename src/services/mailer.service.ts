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
import { MODE } from '../types/enums/mode.enum';

/**
 * @description Manage incoming mail requests
 */
class Mailer {

  /**
   * @description Transporter instance
   */
  transporter: Transporter = null;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  /**
   * @description Send an email by calling concrete transporter instance send method.
   * 
   * @param event Event name
   * @param payload payload
   * 
   * @returns Promise<SendingResponse|SendingError>
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
   * @description Set the from and reply-to addresses using current payload or fallback on cliamrc configuration.
   *
   * @param payload
   */
  private setAddresses(payload: IPayload): void {
    payload.meta.from = !payload.meta.from ? Container.configuration.variables.addresses.from : payload.meta.from;
    payload.meta.replyTo = !payload.meta.replyTo ? Container.configuration.variables.addresses.replyTo : payload.meta.replyTo;
  }

  /**
   * @description Set the render engine to use for the current mailer instance according to the setup.
   *
   * @param event Event name
   * @param payload payload
   */
   private setRenderEngine(event: string, payload: IPayload): void {
    if (this.transporter.configuration.mode === MODE.smtp) {
      payload.renderEngine = payload.content ? RENDER_ENGINE.self : RENDER_ENGINE.default;
    }
    if (this.transporter.configuration.mode === MODE.api) {
      payload.renderEngine =  this.getTemplateId(event) ? RENDER_ENGINE.provider : payload.content ? RENDER_ENGINE.self : RENDER_ENGINE.default;
    }
  }

  /**
   * @description Get the informations needed to send the email (data, teamplate, body of the mail, ...).
   *
   * @param event Event name
   * @param payload payload
   */
  private getBuildable(event: string, payload: IPayload): IBuildable {
    return {
      payload,
      templateId: payload.renderEngine === RENDER_ENGINE.provider ? this.getTemplateId(event) : null,
      body: [ RENDER_ENGINE.self, RENDER_ENGINE.default ].includes(payload.renderEngine as RENDER_ENGINE) ? this.getCompiled(event, payload) : null,
      origin: this.getOrigin()
    }
  }

  /**
   * @description Get the origin domain to use in the setup of the current mailer instance. This is used by some web API providers.
   */
  private getOrigin(): string {
    return Container.configuration.variables.domain;
  }

  /**
   * @description Get the templateID to use in the setup of the current mail sending.
   * 
   * @param event Event name
   */
  private getTemplateId(event: string): string {
    return this.transporter.configuration.options.templates[event] as string;
  }

  /**
   * @description Say if the current request has his own plain text content already compiled.
   * 
   * @param content The buffer value of the request
   */
  private hasPlainText(content: IBuffer[]): boolean {
    return content.some( (buffer: IBuffer) => buffer.type === BUFFER_MIME_TYPE['text/plain'] && buffer.value );
  }

  /**
   * @description Get the final result of the compilation in html and plain text.
   * 
   * @param event Event name
   * @param payload payload
   */
  private getCompiled(event: string, payload: IPayload): { html: string, text: string } {

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

