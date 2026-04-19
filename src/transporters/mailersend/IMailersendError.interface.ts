export interface IMailersendError {
  name: string;
  statusCode: number;
  statusText: string;
  message: string;
  body: { message: string, errors: string };
}
