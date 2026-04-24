export interface ISparkpostResponse {
  results: {
    id: string;
    total_accepted_recipients: number;
    total_rejected_recipients: number;
  };
}
