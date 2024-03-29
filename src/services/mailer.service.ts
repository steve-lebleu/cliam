import { SendingResponse } from './../classes/sending-response.class';
import { SendingError } from './../classes/sending-error.class';
import { IPayload } from './../types/interfaces/IPayload.interface';
import { Transporter } from './../transporters/transporter.class';
import { Container } from './../services/container.service';
import { RenderEngine } from './render-engine.service';
import { RENDER_ENGINE } from '../types/enums/render-engine.enum';
import { IMail } from './../types/interfaces/IMail.interface';
import { IBuffer } from './../types/interfaces/IBuffer.interface';
import { BUFFER_MIME_TYPE } from './../types/enums/buffer-mime-type.enum';
import { mailSchema } from './../validations/mail.validation';

/**
 * @description Main class to manage incoming mail requests. Mostly, this class is responsible of:
 *
 * - Build the meta / data / content of an email using concrete transporter instance methods
 * - Send an email using a concrete transporter instance method
 */
class Mailer {

  /**
   * @description Render engine to use for the current sending
   */
  renderEngine: RENDER_ENGINE = null;

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
   * @returns {Promise<SendingResponse|SendingError>} Result of mail sending
   */
  send = async (event: string, payload: IPayload): Promise<SendingResponse|SendingError> => {
    this.setRenderEngine(event, payload);
    this.setAddresses(payload);
    const error = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false })?.error;
    if (error) {
      return new SendingError(400, 'Validation error', [ error.details.shift().message ]);
    }
    return await this.transporter.send( this.transporter.build( this.getMail(event, payload) ) )
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
   * @description Get the render engine to use for the current mailer instance according to the setup.
   *
   * @param event Event name
   * @param payload payload
   */
   private setRenderEngine(event: string, payload: IPayload): void {
    if(!this.transporter.configuration.provider) {
      if (payload.renderEngine === RENDER_ENGINE.provider) {
        throw new Error(`Render engine cannot be 'provider' with a SMTP email sending. Please use 'self' or 'cliam'`);
      }
      this.renderEngine = payload.renderEngine ? payload.renderEngine : payload.content ? RENDER_ENGINE.self : RENDER_ENGINE.cliam;
    }
    if (this.transporter.configuration.provider) {
      this.renderEngine = payload.renderEngine ? payload.renderEngine : payload.content ? RENDER_ENGINE.self : this.getTemplateId(event) ? RENDER_ENGINE.provider : RENDER_ENGINE.cliam;
    }
  }

  /**
   * @description Get the informations needed to send the email (data, teamplate, body of the mail, ...).
   *
   * @param event Event name
   * @param payload payload
   */
  private getMail(event: string, payload: IPayload): IMail {
    if (this.renderEngine === RENDER_ENGINE.cliam && !RenderEngine.TEMPLATES.find(template => template.event === event)) {
      throw new Error(`No default template available for this custom event (${event}). Please provide your own compilation or push a new merge request ;-)`);
    }
    return {
      payload,
      templateId: this.getTemplateId(event),
      renderEngine: this.renderEngine,
      body: [ RENDER_ENGINE.self, RENDER_ENGINE.cliam ].includes(this.renderEngine) ? this.getCompiled(event, payload) : null,
      origin: this.getOrigin()
    }
  }

  /**
   * @description Get the origin domain to use in the setup of the current mailer instance. This is used by some web API providers such mailgun.
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
    if (!this.transporter.configuration?.templates?.hasOwnProperty(event)) {
      return null;
    }
    return this.transporter.configuration?.templates[event];
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

    if (this.renderEngine === RENDER_ENGINE.self && this.hasPlainText(payload.content)) {
      return {
        html: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value,
        text: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/plain']).value,
      }
    }

    if (this.renderEngine === RENDER_ENGINE.self && !this.hasPlainText(payload.content)) {
      return {
        html: payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value,
        text: RenderEngine.textify(payload.content.find(b => b.type === BUFFER_MIME_TYPE['text/html']).value),
      }
    }

    return RenderEngine.compile(event, Object.assign({ subject: payload.meta.subject }, payload.data));
  }

}

export { Mailer }

