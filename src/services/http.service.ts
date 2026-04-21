import ky, { type KyInstance } from 'ky';
import { isParsable } from '@utils/string.util';

export type HttpClientConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
  retry?: number;
  timeout?: number;
};

export type HttpSuccess<U> = { ok: true; status: number; headers: Record<string, string>; data: U };
export type HttpFailure<W> = { ok: false; status: number; headers: Record<string, string>; data: W };
export type HttpResult<U = unknown, W = unknown> = HttpSuccess<U> | HttpFailure<W>;

export class HttpClient {
  private readonly instance: KyInstance;

  constructor({ baseUrl, headers = {}, retry = 1, timeout = 30_000 }: HttpClientConfig) {
    this.instance = ky.create({
      prefix: baseUrl,
      headers,
      retry,
      timeout,
      throwHttpErrors: false,
    });
  }

  async post<T = unknown, U = unknown, W = unknown>(path: string, body: T, headers?: Record<string, string>): Promise<HttpResult<U, W>> {
    const response = await this.instance.post(path, { json: body, ...(headers && { headers }) });
    return this.normalize<U, W>(response);
  }

  async postForm<T extends Record<string, string | string[]> = Record<string, string | string[]>, U = unknown, W = unknown>(path: string, body: T, headers?: Record<string, string>): Promise<HttpResult<U, W>> {
    const form = new FormData();

    for (const [key, value] of Object.entries(body)) {
      if (Array.isArray(value)) {
        for (const v of value) form.append(key, v);
      } else {
        form.append(key, value);
      }
    }

    const response = await this.instance.post(path, { body: form, ...(headers && { headers }) });
    return this.normalize<U, W>(response);
  }

  async postFormData<U = unknown, W = unknown>(path: string, form: FormData, headers?: Record<string, string>): Promise<HttpResult<U, W>> {
    const response = await this.instance.post(path, { body: form, ...(headers && { headers }) });
    return this.normalize<U, W>(response);
  }

  private async normalize<U, W>(response: Response): Promise<HttpResult<U, W>> {
    const text = await response.text();
    const data = text && isParsable(text) ? JSON.parse(text) : text ? text : null;
    const status = response.status;
    const headers = Object.fromEntries(response.headers.entries());

    if (status >= 400) {
      return { ok: false, status, headers, data: data as W };
    }

    return { ok: true, status, headers, data: data as U };
  }
}
