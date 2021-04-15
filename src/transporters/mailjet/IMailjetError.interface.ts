export interface IMailjetError {
  response: {
    res: {
      text: string
    }
  },
  statusCode: number,
  ErrorMessage: string
}