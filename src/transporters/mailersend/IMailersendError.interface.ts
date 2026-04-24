export interface IMailersendError {
  message: string;
  errors: { [key: string]: string[] };
}
