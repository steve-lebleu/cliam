export interface IMailgunError extends Error {
  name: string;
  status: number;
  type: string;
  details: string;
  statusText: string;
  message: string;
}