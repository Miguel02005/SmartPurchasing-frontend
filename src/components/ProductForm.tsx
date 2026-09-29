'use client';

import React, { useState } from 'react';
import FormInput from './FormInput';
import FormButton from './FormButton';
import { CreateProductDto, Product } from '@/types/product.types';

interface ProductFormProps {
  onSubmit: (dto: Omit<CreateProductDto, 'businessEntityId'>) => void;
  submitting?: boolean;
  // Si viene, el formulario funciona en modo edición
  initialValues?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  submitting = false,
  initialValues,
}) => {
  const isEdit = !!initialValues;

  const [productId, setProductId] = useState(
    initialValues ? String(initialValues.productId) : '',
  );
  const [averageLeadTime, setAverageLeadTime] = useState(
    initialValues ? String(initialValues.averageLeadTime) : '',
  );
  const [standardPrice, setStandardPrice] = useState(
    initialValues ? String(initialValues.standardPrice) : '',
  );
  const [minOrderQty, setMinOrderQty] = useState(
    initialValues ? String(initialValues.minOrderQty) : '',
  );
  const [maxOrderQty, setMaxOrderQty] = useState(
    initialValues ? String(initialValues.maxOrderQty) : '',
  );
  // SQL Server devuelve nchar(3) con espacio sobrante ("EA "), por eso trim()
  const [unitMeasureCode, setUnitMeasureCode] = useState(
    initialValues ? initialValues.unitMeasureCode.trim() : 'EA',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      productId: Number(productId),
      averageLeadTime: Number(averageLeadTime),
      standardPrice: Number(standardPrice),
      minOrderQty: Number(minOrderQty),
      maxOrderQty: Number(maxOrderQty),
      unitMeasureCode: unitMeasureCode.trim().toUpperCase(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      {isEdit ? (
        // El productId no se puede cambiar (el PATCH no lo acepta)
        <div className="sm:col-span-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">
            {initialValues.product?.name ?? `Producto #${initialValues.productId}`}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {initialValues.product?.productNumber ?? ''}
            {initialValues.product?.color
              ? ` · ${initialValues.product.color}`
              : ''}
            {` · ID ${initialValues.productId}`}
          </p>
        </div>
      ) : (
        <FormInput
          label="ID del producto"
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Ej. 680 (debe existir en el catálogo)"
          required
        />
      )}

      <FormInput
        label="Código de unidad"
        value={unitMeasureCode}
        onChange={(e) => setUnitMeasureCode(e.target.value.slice(0, 3))}
        placeholder="Ej. EA"
        required
      />

      <FormInput
        label="Tiempo de entrega"
        type="number"
        value={averageLeadTime}
        onChange={(e) => setAverageLeadTime(e.target.value)}
        placeholder="Días"
        required
      />

      <FormInput
        label="Precio estándar"
        type="number"
        value={standardPrice}
        onChange={(e) => setStandardPrice(e.target.value)}
        placeholder="Ej. 25000"
        required
      />

      <FormInput
        label="Cantidad mínima"
        type="number"
        value={minOrderQty}
        onChange={(e) => setMinOrderQty(e.target.value)}
        placeholder="Ej. 1"
        required
      />

      <FormInput
        label="Cantidad máxima"
        type="number"
        value={maxOrderQty}
        onChange={(e) => setMaxOrderQty(e.target.value)}
        placeholder="Ej. 100"
        required
      />

      <div className="sm:col-span-2 pt-2 flex justify-end">
        <FormButton type="submit" disabled={submitting}>
          {submitting
            ? 'Guardando...'
            : isEdit
              ? 'Guardar cambios'
              : 'Guardar producto'}
        </FormButton>
      </div>
    </form>
  );
};

export default ProductForm;
