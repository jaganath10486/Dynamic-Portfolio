import type { ApiConfig, HttpResponse, NextOptions } from '@interfaces/http.interface'

class FetchClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async executeRequest<T = unknown>(config: ApiConfig): Promise<HttpResponse<T>> {
    const { method, url = '', headers, body, params, cacheOptions, nextOptions } = config

    const fetchURL = new URL(this.baseURL + url)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        fetchURL.searchParams.append(key, value)
      })
    }

    const nextConfig: NextOptions | undefined = nextOptions

    const fetchOptions: RequestInit & { next?: NextOptions } = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers as Record<string, string>),
      },
      ...(body !== undefined && {
        body: body instanceof Blob ? body : JSON.stringify(body),
      }),
      ...(cacheOptions && { cache: cacheOptions }),
      ...(nextConfig && { next: nextConfig }),
    }

    const response = await fetch(fetchURL.toString(), fetchOptions)

    const contentType = response.headers.get('content-type') ?? ''
    const data: T = contentType.includes('application/json')
      ? await response.json()
      : ((await response.text()))

    return {
      data,
      status: response.status,
      headers: response.headers,
      ok: response.ok,
    }
  }
}

export default FetchClient
