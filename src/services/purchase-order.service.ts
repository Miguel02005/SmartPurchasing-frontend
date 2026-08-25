import { api } from '@/lib/api';
import {
  PurchaseOrder,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from '@/types/purchase-order.types';

export async function getMyPurchaseOrders(
  token: string,
): Promise<PurchaseOrder[]> {
  return api.get<PurchaseOrder[]>('/purchase-orders/mine', token);
}

export async function getPurchaseOrder(
  purchaseOrderId: number,
  token: string,
): Promise<PurchaseOrder> {
  return api.get<PurchaseOrder>(`/purchase-orders/${purchaseOrderId}`, token);
}

export async function createPurchaseOrder(
  data: CreatePurchaseOrderDto,
  token: string,
): Promise<PurchaseOrder> {
  return api.post<PurchaseOrder>('/purchase-orders/create', data, token);
}

export async function updatePurchaseOrder(
  purchaseOrderId: number,
  data: UpdatePurchaseOrderDto,
  token: string,
): Promise<PurchaseOrder> {
  return api.patch<PurchaseOrder>(
    `/purchase-orders/${purchaseOrderId}`,
    data,
    token,
  );
}
