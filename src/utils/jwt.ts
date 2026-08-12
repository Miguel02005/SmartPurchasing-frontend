export interface JwtPayload {
  sub: number;
  email: string;
  businessEntityId?: number;
  [key: string]: unknown;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = atob(normalized);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}
