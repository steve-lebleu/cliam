/**
 * @description Define allowed options on a transporter configuration
 */
export interface ITransporterOptions {
  host: string,
  port: number,
  secure: boolean,
  templates: {[event: string]: string}
}