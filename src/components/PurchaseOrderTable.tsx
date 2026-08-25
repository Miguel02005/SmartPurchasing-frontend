import React from 'react';
import { FileEdit, ClipboardList } from 'lucide-react';
import { PurchaseOrder } from '@/types/purchase-order.types';

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  onEdit: (purchaseOrder: PurchaseOrder) => void;
}

const STATUS_LABELS: Record<number, { label: string; className: string }> = {
  1: { label: 'Pending', className: 'bg-amber-50 text-amber-700' },
  2: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700' },
  3: { label: 'Rejected', className: 'bg-red-50 text-red-700' },
  4: { label: 'Complete', className: 'bg-blue-50 text-blue-700' },
};

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  purchaseOrders,
  onEdit,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Orden
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Fecha
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Envío
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Acción
            </th>
          </tr>
        </thead>

        <tbody>
          {purchaseOrders.map((po) => {
            const status = STATUS_LABELS[po.status] ?? {
              label: 'Desconocido',
              className: 'bg-slate-100 text-slate-600',
            };

            return (
              <tr
                key={po.purchaseOrderId}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        PO-{po.purchaseOrderId}
                      </p>
                      <p className="text-xs text-slate-400">
                        Rev. {po.revisionNumber}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="text-sm text-slate-600">
                    {new Date(po.orderDate).toLocaleDateString('es-CO')}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span className="text-sm text-slate-600">
                    {po.shipDate
                      ? new Date(po.shipDate).toLocaleDateString('es-CO')
                      : '—'}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span className="text-sm font-semibold text-slate-800">
                    $
                    {Number(po.totalDue).toLocaleString('es-CO', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>

                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => onEdit(po)}
                    className="
                      inline-flex items-center justify-center
                      w-9 h-9
                      rounded-lg
                      text-slate-400
                      hover:text-blue-600
                      hover:bg-blue-50
                      transition-colors
                    "
                    title="Editar orden"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderTable;
