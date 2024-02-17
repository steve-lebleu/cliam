export interface IMailjetResponse {
  response: {
    config: {
      url: string,
      method: string,
      headers: Record<string,unknown>,
      data: string,
    },
    request: {
      res: {
        httpVersion: string
      }
    }
    status: number,
    statusText: string
  }
}