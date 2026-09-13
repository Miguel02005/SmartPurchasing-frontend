import { ShipMethod } from './ship-method.types';

export type PurchaseOrderStatus = 1 | 2 | 3 | 4;

export interface PurchaseOrderDetail {
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  productId: number;
  orderQty: number;
  unitPrice: number;
  lineTotal: number;
  receivedQty: number;
  rejectedQty: number;
  dueDate: string;
}

export interface PurchaseOrder {
  purchaseOrderId: number;
  businessEntityId: number;
  revisionNumber: number;
  status: PurchaseOrderStatus;
  shipMethodId: number;
  // Poblado por el backend (relations: { shipMethod: true }) en
  // GET /purchase-orders/mine y GET /purchase-orders/:id.
  shipMethod?: ShipMethod;
  orderDate: string;
  shipDate?: string;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  details?: PurchaseOrderDetail[];
}

export interface CreatePurchaseOrderDetailDto {
  productId: number;
  orderQty: number;
  unitPrice: number;
  dueDate?: string;
}

export interface CreatePurchaseOrderDto {
  shipMethodId: number;
  orderDate: string;
  shipDate?: string;
  subTotal?: number;
  taxAmt?: number;
  freight?: number;
  details?: CreatePurchaseOrderDetailDto[];
}

export interface UpdatePurchaseOrderDto {
  shipMethodId?: number;
  orderDate?: string;
  shipDate?: string;
  subTotal?: number;
  taxAmt?: number;
  freight?: number;
  status?: PurchaseOrderStatus;
}

export interface UpdatePurchaseOrderDetailDto {
  orderQty?: number;
  unitPrice?: number;
  dueDate?: string;
}
