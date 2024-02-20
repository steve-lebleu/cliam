import { Url } from "url";

export interface ISendgridResponse {
  request: {
    uri: Url,
    method: string,
    body: Record<string,unknown>
  },
  httpVersion: string;
  headers: Record<string,unknown>;
  statusMessage: string;
}