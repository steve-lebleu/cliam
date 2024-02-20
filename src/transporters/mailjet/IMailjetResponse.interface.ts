export interface IMailjetResponse {
  response: {
    config: {
      url: string,
      method: string,
      headers: Record<string,unknown>,
      data: string,
    },
    headers: Record<string,string>
    request: {
      res: {
        httpVersion: string
      }
    }
    status: number,
    statusText: string
  }
}