export { Cliam } from './core/cliam.class';
export { SendingResponse } from './core/sending-response.class';
export { SendingError } from './core/sending-error.class';
export { EVENT } from './types/enums/event.enum';
export { PROVIDER } from './types/enums/provider.enum';
export { ATTACHMENT_MIME_TYPE } from './types/enums/attachment-mime-type.enum';
export { ATTACHMENT_DISPOSITION } from './types/enums/attachment-disposition.enum';
export { BUFFER_MIME_TYPE } from './types/enums/buffer-mime-type.enum';

export type { IClientConfiguration } from './types/interfaces/IClientConfiguration.interface';
export type { ITransporterConfiguration } from './transporters/ITransporterConfiguration.interface';
export type { Event } from './types/types/event.type';
export type { Provider } from './types/types/provider.type';
export type { IPayload } from './types/interfaces/IPayload.interface';
export type { IAddressable } from './types/interfaces/addresses/IAddressable.interface';
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
import './transporters/sparkpost';
