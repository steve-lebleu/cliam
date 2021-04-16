export interface ISparkpostError {
    statusCode: number;
    errors: {
        message: string;
        description: string;
    }[];
}
