export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
      }
    } catch {
      // la respuesta no traía JSON
    }
    throw new Error(message);
  }

  // 204 No Content (ej. DELETE de detalle de orden) o body vacío:
  // response.json() lanzaría un error de parseo.
  if (response.status === 204) {
    return undefined as T;
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  method: Method,
  endpoint: string,
  data?: unknown,
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  return handleResponse<T>(response);
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>('GET', endpoint, undefined, token),
  post: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>('POST', endpoint, data, token),
  put: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>('PUT', endpoint, data, token),
  patch: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>('PATCH', endpoint, data, token),
  delete: <T>(endpoint: string, token?: string) =>
    request<T>('DELETE', endpoint, undefined, token),
};
