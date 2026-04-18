import ky, { type KyInstance } from 'ky';

export type HttpClientConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
  retry?: number;
  timeout?: number;
};

export type HttpResult<T = unknown> = {
  status: number;
  headers: Record<string, string>;
  data: T;
};

export class HttpClient {
  private readonly instance: KyInstance;

  constructor({ baseUrl, headers = {}, retry = 1, timeout = 30_000 }: HttpClientConfig) {
    this.instance = ky.create({
      prefix: baseUrl,
      headers,
      retry,
      timeout,
    });
  }

  async post<T = unknown>(path: string, body: unknown, headers?: Record<string, string>): Promise<HttpResult<T>> {
    const response = await this.instance.post(path, { json: body, headers });

    return this.normalize<T>(response);
  }

  async postForm<T = unknown>(path: string, body: Record<string, string | string[]>, headers?: Record<string, string>): Promise<HttpResult<T>> {
    const form = new FormData();

    for (const [key, value] of Object.entries(body)) {
      if (Array.isArray(value)) {
        for (const v of value) form.append(key, v);
      } else {
        form.append(key, value);
      }
    }

    const response = await this.instance.post(path, { body: form, headers });

    return this.normalize<T>(response);
  }

  private async normalize<T>(response: Response): Promise<HttpResult<T>> {
    const text = await response.text();

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: text ? JSON.parse(text) as T : null as T,
    };
  }
}
