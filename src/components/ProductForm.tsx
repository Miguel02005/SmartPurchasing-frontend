'use client';

import React, { useState } from 'react';
import FormInput from './FormInput';
import FormButton from './FormButton';
import { CreateProductDto } from '@/types/product.types';

interface ProductFormProps {
  onSubmit: (
    dto: Omit<CreateProductDto, 'businessEntityId'>
  ) => void;
  submitting?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  submitting = false,
}) => {
  const [productId, setProductId] = useState('');
  const [averageLeadTime, setAverageLeadTime] = useState('');
  const [standardPrice, setStandardPrice] = useState('');
  const [minOrderQty, setMinOrderQty] = useState('');
  const [maxOrderQty, setMaxOrderQty] = useState('');
  const [unitMeasureCode, setUnitMeasureCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      productId: Number(productId),
      averageLeadTime: Number(averageLeadTime),
      standardPrice: Number(standardPrice),
      minOrderQty: Number(minOrderQty),
      maxOrderQty: Number(maxOrderQty),
      unitMeasureCode: unitMeasureCode.toUpperCase(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <FormInput
        label="ID del producto"
        type="number"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="Ej. 1001"
        required
      />

      <FormInput
        label="Código de unidad"
        value={unitMeasureCode}
        onChange={(e) => setUnitMeasureCode(e.target.value)}
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
        <FormButton
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Guardando producto...' : 'Guardar producto'}
        </FormButton>
      </div>
    </form>
  );
};

export default ProductForm;