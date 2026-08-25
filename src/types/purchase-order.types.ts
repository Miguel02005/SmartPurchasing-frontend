// Status codes que maneja el backend (ver update-purchase-order.dto.ts)
// 1 = Pending, 2 = Approved, 3 = Rejected, 4 = Complete
export type PurchaseOrderStatus = 1 | 2 | 3 | 4;

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
}

export interface CreatePurchaseOrderDto {
  shipMethodId: number;
  orderDate: string;
  shipDate?: string;
  // Normalmente se recalculan al agregar líneas de detalle (HU-02),
  // pero el backend los acepta opcionalmente desde ya.
  subTotal?: number;
  taxAmt?: number;
  freight?: number;
}

// El backend no permite actualizar businessEntityId ni employeeId vía este DTO;
// status sí es editable en el update (no en el create).
export type UpdatePurchaseOrderDto = Partial<CreatePurchaseOrderDto> & {
  status?: PurchaseOrderStatus;
};
