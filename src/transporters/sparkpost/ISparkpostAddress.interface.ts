export interface ISparkpostAddress {
  address: string | { email: string; name?: string; type?: string;};
  header_to?: string;
  email?: string;
}
