export interface ISendinblueResponse {
  messageId: string
  res: {
    httpVersion: string,
    headers: Record<string,unknown>,
    method: string,
    statusMessage: string,
    req: {
      protocol: string,
      host: string,
      path: string
    } 
  },
  body: Record<string,unknown>
}