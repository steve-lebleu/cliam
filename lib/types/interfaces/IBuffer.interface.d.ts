import { BufferMimeType } from '../types/buffer-mime-type.type';
/**
 * Describe fields of an email buffer
 */
export interface IBuffer {
    /**
     * @description Mime-type of the buffer
     */
    type: BufferMimeType;
    /**
     * @description Text content of the buffer
     */
    value: string;
}
