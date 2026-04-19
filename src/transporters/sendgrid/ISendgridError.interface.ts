export interface ISendgridErrorDetail {
  message: string;
  field?: string | null;
  help?: string;
}

export interface ISendgridError {
  errors: ISendgridErrorDetail[];
}
