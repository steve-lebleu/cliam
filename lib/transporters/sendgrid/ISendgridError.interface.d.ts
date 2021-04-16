export interface ISendgridError {
    statusCode?: number;
    code?: number;
    name?: string;
    message?: string;
    response?: {
        body: {
            errors: string[];
        };
    };
}
