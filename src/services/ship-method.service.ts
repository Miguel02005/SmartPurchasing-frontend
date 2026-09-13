import { api } from '@/lib/api';
import { ShipMethod } from '@/types/ship-method.types';

export async function getShipMethods(token: string): Promise<ShipMethod[]> {
  return api.get<ShipMethod[]>('/ship-methods', token);
}

export async function getShipMethod(
  shipMethodId: number,
  token: string,
): Promise<ShipMethod> {
  return api.get<ShipMethod>(`/ship-methods/${shipMethodId}`, token);
}
