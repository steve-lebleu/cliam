export interface IMailgunError extends Error {
    name: string;
    statusCode: number;
    statusText: string;
    message: string;
}
