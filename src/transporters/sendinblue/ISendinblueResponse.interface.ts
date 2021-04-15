export interface ISendinblueResponse {
  res: {
    httpVersion: string,
    headers: Record<string,unknown>,
    method: string,
    statusMessage: string
  },
  body: Record<string,unknown>
}