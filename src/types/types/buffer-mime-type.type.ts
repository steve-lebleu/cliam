/**
 * @description Define email buffer supported mimes
 */
 export const BUFFER_MIME_TYPE = {
  'text/plain': 'text/plain',
  'text/html': 'text/html'
} as const;

/**
 * @description Email MIME types
 */
export type BufferMimeType = typeof BUFFER_MIME_TYPE[keyof typeof BUFFER_MIME_TYPE];
