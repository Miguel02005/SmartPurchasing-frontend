import { api } from '@/lib/api';
import {
  PurchaseOrder,
  PurchaseOrderDetail,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  UpdatePurchaseOrderDetailDto,
} from '@/types/purchase-order.types';

export async function getMyPurchaseOrders(
  token: string,
): Promise<PurchaseOrder[]> {
  return api.get<PurchaseOrder[]>('/purchase-orders/mine', token);
}

// Este es el único que trae las líneas de detalle pobladas (details[]).
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

export async function updatePurchaseOrderDetail(
  purchaseOrderId: number,
  purchaseOrderDetailId: number,
  data: UpdatePurchaseOrderDetailDto,
  token: string,
): Promise<PurchaseOrderDetail> {
  return api.patch<PurchaseOrderDetail>(
    `/purchase-orders/${purchaseOrderId}/details/${purchaseOrderDetailId}`,
    data,
    token,
  );
}

export async function removePurchaseOrderDetail(
  purchaseOrderId: number,
  purchaseOrderDetailId: number,
  token: string,
): Promise<void> {
  return api.delete<void>(
    `/purchase-orders/${purchaseOrderId}/details/${purchaseOrderDetailId}`,
    token,
  );
}