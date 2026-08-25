'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import FormInput from './FormInput';
import FormButton from './FormButton';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  CreatePurchaseOrderDetailDto,
  PurchaseOrder,
  PurchaseOrderStatus,
} from '@/types/purchase-order.types';

interface PurchaseOrderFormProps {
  mode: 'create' | 'edit';
  initialData?: PurchaseOrder | null;
  onSubmit: (dto: CreatePurchaseOrderDto | UpdatePurchaseOrderDto) => void;
  submitting?: boolean;
}

// IDs válidos conocidos de Purchasing.ShipMethod. El backend no expone un
// endpoint para consultarlos y no podemos tocar el backend, así que los
// dejamos fijos aquí.
const SHIP_METHODS: { id: number; label: string }[] = [
  { id: 1, label: '1 — Método de envío 1' },
  { id: 2, label: '2 — Método de envío 2' },
  { id: 3, label: '3 — Método de envío 3' },
  { id: 4, label: '4 — Método de envío 4' },
  { id: 5, label: '5 — Método de envío 5' },
];

interface DraftLine extends CreatePurchaseOrderDetailDto {
  key: string;
}

const emptyLine = (): DraftLine => ({
  key: crypto.randomUUID(),
  productId: 0,
  orderQty: 1,
  unitPrice: 0,
  dueDate: undefined,
});

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  mode,
  initialData,
  onSubmit,
  submitting = false,
}) => {
  const [shipMethodId, setShipMethodId] = useState<number>(
    initialData?.shipMethodId ?? SHIP_METHODS[0].id,
  );
  const [orderDate, setOrderDate] = useState(
    initialData?.orderDate ? initialData.orderDate.slice(0, 10) : '',
  );
  const [shipDate, setShipDate] = useState(
    initialData?.shipDate ? initialData.shipDate.slice(0, 10) : '',
  );
  const [taxAmt, setTaxAmt] = useState(
    initialData?.taxAmt !== undefined ? String(initialData.taxAmt) : '0',
  );
  const [freight, setFreight] = useState(
    initialData?.freight !== undefined ? String(initialData.freight) : '0',
  );
  const [status, setStatus] = useState<PurchaseOrderStatus>(
    initialData?.status ?? 1,
  );

  // Líneas de producto — solo aplican al crear (el backend no acepta
  // details[] en el update de cabecera; agregar/editar líneas de una
  // orden ya existente se hace desde la pantalla de detalle).
  const [lines, setLines] = useState<DraftLine[]>([]);

  // Solo lectura: el backend todavía no acepta revisionNumber en
  // CreatePurchaseOrderDto ni UpdatePurchaseOrderDto.
  const revisionNumber = initialData?.revisionNumber ?? 0;

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (key: string) =>
    setLines((prev) => prev.filter((l) => l.key !== key));

  const updateLine = <K extends keyof CreatePurchaseOrderDetailDto>(
    key: string,
    field: K,
    value: CreatePurchaseOrderDetailDto[K],
  ) => {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, [field]: value } : l)),
    );
  };

  const linesTotal = lines.reduce(
    (sum, l) => sum + (Number(l.orderQty) || 0) * (Number(l.unitPrice) || 0),
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const base: CreatePurchaseOrderDto = {
      shipMethodId,
      orderDate,
      shipDate: shipDate || undefined,
      taxAmt: Number(taxAmt),
      freight: Number(freight),
    };

    if (mode === 'edit') {
      const dto: UpdatePurchaseOrderDto = { ...base, status };
      onSubmit(dto);
    } else {
      const validLines = lines
        .filter((l) => l.productId > 0 && l.orderQty > 0)
        .map(({ key, ...rest }) => rest);

      onSubmit({
        ...base,
        ...(validLines.length > 0 ? { details: validLines } : {}),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Método de envío
          </label>
          <select
            value={shipMethodId}
            onChange={(e) => setShipMethodId(Number(e.target.value))}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {SHIP_METHODS.map((sm) => (
              <option key={sm.id} value={sm.id}>
                {sm.label}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Fecha de orden"
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de revisión
          </label>
          <input
            type="number"
            value={revisionNumber}
            disabled
            readOnly
            title="El backend todavía no permite editar este campo"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-100 leading-tight cursor-not-allowed"
          />
        </div>

        <FormInput
          label="Fecha de envío"
          type="date"
          value={shipDate}
          onChange={(e) => setShipDate(e.target.value)}
        />

        <FormInput
          label="Impuesto (TaxAmt)"
          type="number"
          value={taxAmt}
          onChange={(e) => setTaxAmt(e.target.value)}
          placeholder="0"
        />

        <FormInput
          label="Flete (Freight)"
          type="number"
          value={freight}
          onChange={(e) => setFreight(e.target.value)}
          placeholder="0"
        />

        {mode === 'edit' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(Number(e.target.value) as PurchaseOrderStatus)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value={1}>Pending</option>
              <option value={2}>Approved</option>
              <option value={3}>Rejected</option>
              <option value={4}>Complete</option>
            </select>
          </div>
        )}
      </div>

      {/* LÍNEAS DE PRODUCTO — solo al crear */}
      {mode === 'create' && (
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Productos (opcional)
              </p>
              <p className="text-xs text-gray-400">
                Puedes crear la orden sin productos y agregarlos después,
                o cargarlos aquí de una vez.
              </p>
            </div>
            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Agregar producto
            </button>
          </div>

          {lines.length > 0 && (
            <div className="space-y-3">
              {lines.map((line) => (
                <div
                  key={line.key}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end bg-gray-50 rounded-lg p-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ID producto
                    </label>
                    <input
                      type="number"
                      value={line.productId || ''}
                      onChange={(e) =>
                        updateLine(line.key, 'productId', Number(e.target.value))
                      }
                      placeholder="Ej. 707"
                      className="w-full rounded border border-gray-200 py-1.5 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={line.orderQty || ''}
                      onChange={(e) =>
                        updateLine(line.key, 'orderQty', Number(e.target.value))
                      }
                      className="w-full rounded border border-gray-200 py-1.5 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Precio unitario
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.unitPrice || ''}
                      onChange={(e) =>
                        updateLine(line.key, 'unitPrice', Number(e.target.value))
                      }
                      className="w-full rounded border border-gray-200 py-1.5 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Fecha entrega
                    </label>
                    <input
                      type="date"
                      value={line.dueDate ?? ''}
                      onChange={(e) =>
                        updateLine(line.key, 'dueDate', e.target.value)
                      }
                      className="w-full rounded border border-gray-200 py-1.5 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Quitar línea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <p className="text-right text-sm text-gray-500">
                Subtotal de productos:{' '}
                <span className="font-semibold text-gray-800">
                  $
                  {linesTotal.toLocaleString('es-CO', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <FormButton type="submit" disabled={submitting}>
          {submitting
            ? 'Guardando orden...'
            : mode === 'edit'
              ? 'Guardar cambios'
              : 'Crear orden'}
        </FormButton>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
