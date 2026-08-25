// Status codes que maneja el backend (ver update-purchase-order.dto.ts)
// 1 = Pending, 2 = Approved, 3 = Rejected, 4 = Complete
export type PurchaseOrderStatus = 1 | 2 | 3 | 4;

export interface PurchaseOrderDetail {
  purchaseOrderId: number;
  purchaseOrderDetailId: number;
  dueDate: string;
  orderQty: number;
  productId: number;
  unitPrice: number;
  lineTotal: number; // calculado en el backend (orderQty * unitPrice)
  receivedQty: number;
  rejectedQty: number;
  stockedQty: number;
  modifiedDate: string;
}

export interface PurchaseOrder {
  purchaseOrderId: number;
  shipMethodId: number;
  businessEntityId: number; // vendor
  employeeId: number;
  revisionNumber: number;
  status: PurchaseOrderStatus;
  orderDate: string;
  shipDate?: string | null;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number; // calculado en el backend, no se envía en create/update
  modifiedDate: string;
  // Solo viene poblado cuando consultas GET /purchase-orders/:id (findOne),
  // el listado GET /purchase-orders/mine no trae las líneas.
  details?: PurchaseOrderDetail[];
}

export interface CreatePurchaseOrderDetailDto {
  productId: number;
  orderQty: number;
  unitPrice: number;
  dueDate?: string;
}

// NOTA: el backend solo acepta agregar líneas en el momento de crear la
// orden (POST /purchase-orders/create con details[]). Todavía no existe
// un POST /purchase-orders/:id/details para agregar líneas a una orden
// ya creada — pendiente de que el equipo de backend lo agregue.
export interface CreatePurchaseOrderDto {
  shipMethodId: number;
  orderDate: string;
  shipDate?: string;
  // Normalmente se recalculan al agregar líneas de detalle,
  // pero el backend los acepta opcionalmente desde ya.
  subTotal?: number;
  taxAmt?: number;
  freight?: number;
  details?: CreatePurchaseOrderDetailDto[];
}

// El backend no permite actualizar businessEntityId ni employeeId vía este DTO;
// status sí es editable en el update (no en el create).
export type UpdatePurchaseOrderDto = Partial<
  Omit<CreatePurchaseOrderDto, 'details'>
> & {
  status?: PurchaseOrderStatus;
};

export type UpdatePurchaseOrderDetailDto = Partial<
  Omit<CreatePurchaseOrderDetailDto, 'productId'>
>;