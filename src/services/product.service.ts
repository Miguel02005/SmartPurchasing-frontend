import { api } from '@/lib/api';
import {
  Product,
  ProductRaw,
  CreateProductDto,
  UpdateProductDto,
} from '@/types/product.types';

export async function getMyProducts(token: string): Promise<Product[]> {
  return api.get<Product[]>('/products/mine', token);
}

// A diferencia de create/update, este SÍ trae el objeto `product` (join).
export async function getProduct(
  productId: number,
  token: string,
): Promise<Product> {
  return api.get<Product>(`/products/${productId}`, token);
}

// Devuelve la entidad cruda (sin `product`). Para obtener el producto
// completo, encadenar con getProduct.
export async function createProduct(
  data: CreateProductDto,
  token: string,
): Promise<ProductRaw> {
  return api.post<ProductRaw>('/products/create', data, token);
}

export async function updateProduct(
  productId: number,
  data: UpdateProductDto,
  token: string,
): Promise<ProductRaw> {
  return api.patch<ProductRaw>(`/products/${productId}`, data, token);
}

export async function deleteProduct(
  productId: number,
  token: string,
): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/products/${productId}`, token);
}
