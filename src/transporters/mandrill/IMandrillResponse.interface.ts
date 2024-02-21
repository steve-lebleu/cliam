export interface IMandrillResponse {
  messageId: string
  accepted: {
    _id: string,
    email: string
    status: string
    queued_reason: string
  }[]
  rejected: {
    _id: string,
    email: string
    status: string
    reject_reason: string
    queued_reason: string
  }[]
}

