import { api } from '@/lib/api';
import { Product, CreateProductDto, UpdateProductDto } from '@/types/product.types';

export async function getMyProducts(token: string): Promise<Product[]> {
  return api.get<Product[]>('/products/mine', token);
}

export async function createProduct(
  data: CreateProductDto,
  token: string,
): Promise<Product> {
  return api.post<Product>('/products/create', data, token);
}

export async function updateProduct(
  productId: number,
  data: UpdateProductDto,
  token: string,
): Promise<Product> {
  return api.patch<Product>(`/products/${productId}`, data, token);
}

export async function deleteProduct(
  productId: number,
  token: string,
): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/products/${productId}`, token);
}
