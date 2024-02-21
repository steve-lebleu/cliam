export interface IPostmarkResponse {
  messageId: string
  accepted: {
    ErrorCode: number,
    Message: string,
    MessageID: string,
    SubmittedAt: string,
    To: string
  } []
  rejected: {
    ErrorCode: number,
    Message: string,
    MessageID: string,
    SubmittedAt: string,
    To: string
  } []
  originalResult: {
    ErrorCode: number,
    Message: string,
    MessageID: string,
    SubmittedAt: string,
    To: string
  } []
}