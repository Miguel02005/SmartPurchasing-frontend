import React from 'react';
import { Trash2, Package } from 'lucide-react';
import { Product } from '@/types/product.types';

interface ProductTableProps {
  products: Product[];
  onDelete: (productId: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Producto
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Unidad
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Precio
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Entrega
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Pedido
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Acción
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p.productId}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
            >
              {/* Producto */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Producto #{p.productId}
                    </p>

                    <p className="text-xs text-slate-400">
                      ID {p.productId}
                    </p>
                  </div>
                </div>
              </td>

              {/* Unidad */}
              <td className="px-4 py-4">
                <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {p.unitMeasureCode}
                </span>
              </td>

              {/* Precio */}
              <td className="px-4 py-4">
                <span className="text-sm font-semibold text-slate-800">
                  $
                  {Number(p.standardPrice).toLocaleString('es-CO', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </td>

              {/* Entrega */}
              <td className="px-4 py-4">
                <span className="text-sm text-slate-600">
                  {p.averageLeadTime} días
                </span>
              </td>

              {/* Min / Max */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    {p.minOrderQty}
                  </span>

                  <span className="text-slate-300">→</span>

                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    {p.maxOrderQty}
                  </span>
                </div>
              </td>

              {/* Eliminar */}
              <td className="px-4 py-4 text-right">
                <button
                  onClick={() => onDelete(p.productId)}
                  className="
                    inline-flex items-center justify-center
                    w-9 h-9
                    rounded-lg
                    text-slate-400
                    hover:text-red-600
                    hover:bg-red-50
                    transition-colors
                  "
                  title="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;