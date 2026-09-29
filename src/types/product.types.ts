export interface ProductSummary {
  productId: number;
  name: string;
  productNumber: string;
  color: string | null;
}

// Respuesta de GET /products/mine y GET /products/{productId}
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
  product: ProductSummary;
  modifiedDate: string;
}

// POST /products/create y PATCH /products/{id} devuelven la entidad
// cruda del backend, SIN el objeto `product`.
export type ProductRaw = Omit<Product, 'product'>;

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
