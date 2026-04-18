export interface IMandrillResponse {
  _id: string;
  email: string;
  status: string;
  reject_reason: string | null;
}
