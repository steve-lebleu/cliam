export interface IMailjetError {
  ErrorIdentifier: string;
  ErrorCode: string;
  StatusCode: number;
  ErrorMessage: string;
  ErrorRelatedTo: string[];
}
