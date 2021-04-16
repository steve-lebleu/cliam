/// <reference types="node" />
/**
 * @decription Shuffle an array | string as array of chars
 *
 * @param a
 */
declare const shuffle: (a: any[]) => string;
/**
 * @description Hash a string
 *
 * @param str Base string to hash
 * @param length Number of chars to return
 */
declare const hash: (str: string, length: number) => string;
/**
 * @description Encode binary file in base64
 * @param path
 */
declare const base64Encode: (path: string) => string;
/**
 * @description Decode base64 encoded stream and write binary file
 * @param path
 */
declare const base64Decode: (stream: Buffer, path: string) => void;
/**
 * @description Decrypt text
 *
 * @param cipherText
 */
declare const decrypt: (cipherText: string) => string;
/**
 * @description Encrypt text
 *
 * @param text
 */
declare const encrypt: (text: string) => string;
/**
 * @description Get filename without extension
 * @param name Filename to parse
 */
declare const filename: (name: string) => string;
/**
 * @description Get file extension with or without .
 * @param name Filename to parse
 * @param include Get extension with . if true, without . else
 */
declare const extension: (name: string, include?: boolean) => string;
export { base64Encode, base64Decode, decrypt, encrypt, extension, filename, hash, shuffle };
