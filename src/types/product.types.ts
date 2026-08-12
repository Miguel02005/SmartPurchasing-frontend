export interface Product {
  productId: number;
  businessEntityId: number;
  averageLeadTime: number;
  standardPrice: number;
  lastReceiptCost?: number | null;
  lastReceiptDate?: string | null;
  minOrderQty: number;
  maxOrderQty: number;
  onOrderQty?: number | null;
  unitMeasureCode: string;
  modifiedDate: string;
}

export interface CreateProductDto {
  productId: number;
  businessEntityId: number;
  averageLeadTime: number;
  standardPrice: number;
  lastReceiptCost?: number;
  lastReceiptDate?: string;
  minOrderQty: number;
  maxOrderQty: number;
  onOrderQty?: number;
  unitMeasureCode: string;
}

// El backend no permite actualizar productId ni businessEntityId (ver UpdateProductVendorDto)
export type UpdateProductDto = Partial<
  Omit<CreateProductDto, 'productId' | 'businessEntityId'>
>;
