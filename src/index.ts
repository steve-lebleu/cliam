export { Cliam } from './core/cliam.class';
export { SendingResponse } from './core/sending-response.class';
export { SendingError } from './core/sending-error.class';
export { ATTACHMENT_MIME_TYPE } from './types/enums/attachment-mime-type.enum';
export { ATTACHMENT_DISPOSITION } from './types/enums/attachment-disposition.enum';

export type { IClientConfiguration } from './types/interfaces/IClientConfiguration.interface';
export type { ITransporterConfiguration } from './transporters/ITransporterConfiguration.interface';
export type { BufferMimeType, BUFFER_MIME_TYPE } from './types/types/buffer-mime-type.type';
export type { Event, EVENT } from './types/types/event.type';
export type { Provider, PROVIDER } from './types/types/provider.type';
export type { IPayload } from './types/interfaces/IPayload.interface';
export type { IAddressable } from './types/interfaces/IAddressable.interface';
export type { IAttachment } from './types/interfaces/IAttachment.interface';
export type { IBuffer } from './types/interfaces/IBuffer.interface';
export type { IPlaceholder } from './types/interfaces/IPlaceholder.interface';
export type { ISendingResponse } from './types/interfaces/ISendingResponse.interface';
export type { ISendingError } from './types/interfaces/ISendingError.interface';

// Register all providers — import from 'cliam/core' + individual 'cliam/providers/*' to load selectively
import './transporters/smtp';
import './transporters/brevo';
import './transporters/mailersend';
import './transporters/mailgun';
import './transporters/mailjet';
import './transporters/mandrill';
import './transporters/postmark';
import './transporters/sendgrid';
import './transporters/resend';
import './transporters/sparkpost';
