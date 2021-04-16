export interface IMandrillResponse {
    request: {
        uri: string;
        method: string;
        body: Record<string, unknown>;
    };
    httpVersion: string;
    headers: Record<string, unknown>;
    statusMessage: string;
}
