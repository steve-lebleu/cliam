import { SendingError } from '@core/sending-error.class';
import type { SendingResponse } from '@core/sending-response.class';

import { Container } from '@services/container.service';
import { RenderEngine } from '@services/render-engine.service';
import type { Transporter } from '@transporters/transporter.class';

import { BUFFER_MIME_TYPE } from '@typings/buffer-mime-type.type';
import { RENDER_ENGINE, type RenderEngine as RenderEngineType } from '@typings/render-engine.type';

import type { IBuffer } from '@interfaces/IBuffer.interface';
import type { IMail } from '@interfaces/IMail.interface';
import type { IPayload } from '@interfaces/IPayload.interface';

import { mailSchema } from '@validations/mail.validation';

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
  renderEngine!: RenderEngineType;

  /**
   * @description Transporter instance
   */
  transporter!: Transporter;

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

    const { error } = mailSchema.validate(payload, { abortEarly: true, allowUnknown: false });

    if (error) {
      const msg = error.details.shift()?.message ?? 'Unknown error';
      return new SendingError(400, 'Validation error', [ msg ]);
    }

    return await this.transporter.send( this.transporter.build( this.getMail(event, payload) ) )
  }

  /**
   * @description Set the from and reply-to addresses using current payload or fallback on cliamrc configuration.
   *
   * @param payload
   */
  private setAddresses(payload: IPayload): void {
    payload.meta.from = payload.meta.from ?? Container.configuration.variables.addresses.from;
    payload.meta.replyTo = payload.meta.replyTo ?? Container.configuration.variables.addresses.replyTo;
  }

  /**
   * @description Infer the render engine from the transporter configuration and payload content.
   *
   * SMTP: content present → self, otherwise → cliam
   * Web API: content present → self, template configured → provider, otherwise → cliam
   *
   * @param event Event name
   * @param payload payload
   */
   private setRenderEngine(event: string, payload: IPayload): void {
    if (payload.content) {
      this.renderEngine = RENDER_ENGINE.self;
      return;
    }

    if (this.transporter.configuration.provider && this.getTemplateId(event)) {
      this.renderEngine = RENDER_ENGINE.provider;
      return;
    }

    this.renderEngine = RENDER_ENGINE.cliam;
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
      payload: payload as IMail['payload'],
      templateId: this.getTemplateId(event),
      renderEngine: this.renderEngine,
      body: (RENDER_ENGINE.self === this.renderEngine || RENDER_ENGINE.cliam === this.renderEngine) ? this.getCompiled(event, payload) : null,
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
  private getTemplateId(event: string): string | null {
    if (!this.transporter.configuration?.templates?.[event]) {
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
    const { content } = payload;

    if (this.renderEngine === RENDER_ENGINE.self && this.hasPlainText(content as IBuffer[])) {
      return {
        html: content?.find(b => b.type === BUFFER_MIME_TYPE['text/html'])?.value ?? '',
        text: content?.find(b => b.type === BUFFER_MIME_TYPE['text/plain'])?.value ?? '',
      }
    }

    if (this.renderEngine === RENDER_ENGINE.self && !this.hasPlainText(content as IBuffer[])) {
      return {
        html: content?.find(b => b.type === BUFFER_MIME_TYPE['text/html'])?.value ?? '',
        text: RenderEngine.textify(content?.find(b => b.type === BUFFER_MIME_TYPE['text/html'])?.value ?? ''),
      }
    }

    return RenderEngine.compile(event, Object.assign({ subject: payload.meta.subject }, payload.data));
  }

}

export { Mailer }
