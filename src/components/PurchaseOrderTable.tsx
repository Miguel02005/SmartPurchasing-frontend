'use client';

import React, { useState } from 'react';
import {
  FileEdit,
  ClipboardList,
  ChevronDown,
  Package,
  Trash2,
  Pencil,
  X,
  Check,
  CalendarClock,
  Boxes,
} from 'lucide-react';
import { PurchaseOrder, PurchaseOrderDetail } from '@/types/purchase-order.types';

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  onEdit: (purchaseOrder: PurchaseOrder) => void;
  onUpdateLine: (
    purchaseOrderId: number,
    purchaseOrderDetailId: number,
    dto: { orderQty?: number; unitPrice?: number; dueDate?: string },
  ) => Promise<void>;
  onRemoveLine: (
    purchaseOrderId: number,
    purchaseOrderDetailId: number,
  ) => Promise<void>;
}

const STATUS_STYLES: Record<
  number,
  { label: string; className: string; barColor: string }
> = {
  1: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700',
    barColor: 'border-amber-500',
  },
  2: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700',
    barColor: 'border-emerald-500',
  },
  3: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700',
    barColor: 'border-red-700',
  },
  4: {
    label: 'Complete',
    className: 'bg-blue-50 text-blue-700',
    barColor: 'border-blue-800',
  },
};

const money = (n: number) =>
  Number(n || 0).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface EditDraft {
  orderQty: string;
  unitPrice: string;
  dueDate: string;
}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  purchaseOrders,
  onEdit,
  onUpdateLine,
  onRemoveLine,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingLineId, setEditingLineId] = useState<number | null>(null);
  const [draft, setDraft] = useState<EditDraft>({
    orderQty: '',
    unitPrice: '',
    dueDate: '',
  });
  const [savingLine, setSavingLine] = useState(false);
  const [lineError, setLineError] = useState('');

  const toggleExpand = (purchaseOrderId: number) => {
    setExpandedId((prev) => (prev === purchaseOrderId ? null : purchaseOrderId));
    setEditingLineId(null);
    setLineError('');
  };

  const startEditLine = (line: PurchaseOrderDetail) => {
    setLineError('');
    setEditingLineId(line.purchaseOrderDetailId);
    setDraft({
      orderQty: String(line.orderQty),
      unitPrice: String(line.unitPrice),
      dueDate: line.dueDate.slice(0, 10),
    });
  };

  const cancelEditLine = () => {
    setEditingLineId(null);
    setLineError('');
  };

  const saveEditLine = async (purchaseOrderId: number, detailId: number) => {
    setSavingLine(true);
    setLineError('');
    try {
      await onUpdateLine(purchaseOrderId, detailId, {
        orderQty: Number(draft.orderQty),
        unitPrice: Number(draft.unitPrice),
        dueDate: draft.dueDate || undefined,
      });
      setEditingLineId(null);
    } catch (err) {
      setLineError(
        err instanceof Error ? err.message : 'No se pudo actualizar la línea',
      );
    } finally {
      setSavingLine(false);
    }
  };

  const handleRemoveLine = async (purchaseOrderId: number, detailId: number) => {
    if (!confirm('¿Eliminar esta línea de la orden?')) return;
    setLineError('');
    try {
      await onRemoveLine(purchaseOrderId, detailId);
    } catch (err) {
      setLineError(
        err instanceof Error ? err.message : 'No se pudo eliminar la línea',
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="w-10"></th>
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
            const status = STATUS_STYLES[po.status] ?? {
              label: 'Desconocido',
              className: 'bg-slate-100 text-slate-600',
              barColor: 'border-slate-300',
            };

            const rawTotal = Number(po.totalDue);
            const fallbackTotal =
              Number(po.subTotal || 0) +
              Number(po.taxAmt || 0) +
              Number(po.freight || 0);
            const displayTotal = Number.isFinite(rawTotal)
              ? rawTotal
              : fallbackTotal;

            const isExpanded = expandedId === po.purchaseOrderId;
            const details = po.details ?? [];

            return (
              <React.Fragment key={po.purchaseOrderId}>
                <tr
                  onClick={() => toggleExpand(po.purchaseOrderId)}
                  className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors cursor-pointer ${
                    isExpanded ? 'bg-slate-50/70' : ''
                  }`}
                >
                  <td className="pl-4">
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </td>

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
                          Rev. {po.revisionNumber} · {details.length}{' '}
                          {details.length === 1 ? 'línea' : 'líneas'}
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
                      ${money(displayTotal)}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(po);
                      }}
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

                {isExpanded && (
                  <tr className="bg-slate-50/40">
                    <td colSpan={7} className="p-0">
                      <div
                        className={`mx-4 my-3 rounded-xl border-l-4 ${status.barColor} bg-white shadow-sm overflow-hidden`}
                      >
                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/60">
                          <div className="flex items-center gap-2">
                            <Boxes className="w-4 h-4 text-slate-400" />
                            <p className="text-sm font-semibold text-slate-700">
                              Productos en PO-{po.purchaseOrderId}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400">
                            {details.length}{' '}
                            {details.length === 1 ? 'línea' : 'líneas'}
                          </span>
                        </div>

                        {lineError && (
                          <div className="mx-5 mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {lineError}
                          </div>
                        )}

                        {details.length === 0 ? (
                          <div className="py-8 flex flex-col items-center text-center">
                            <Package className="w-6 h-6 text-slate-300 mb-1" />
                            <p className="text-sm text-slate-500">
                              Esta orden todavía no tiene productos.
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-50">
                            {details.map((line) => {
                              const isEditingLine =
                                editingLineId === line.purchaseOrderDetailId;

                              return (
                                <div
                                  key={line.purchaseOrderDetailId}
                                  className="group px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50/60 transition-colors"
                                >
                                  {/* Producto */}
                                  <div className="flex items-center gap-3 sm:w-48 shrink-0">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                      <Package className="w-3.5 h-3.5 text-indigo-500" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400">
                                        Línea #{line.purchaseOrderDetailId}
                                      </p>
                                      <p className="text-sm font-semibold text-slate-800">
                                        Producto {line.productId}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Cantidad / precio / total */}
                                  {isEditingLine ? (
                                    <div className="flex flex-wrap items-center gap-2 flex-1">
                                      <input
                                        type="number"
                                        min={1}
                                        value={draft.orderQty}
                                        onChange={(e) =>
                                          setDraft((d) => ({
                                            ...d,
                                            orderQty: e.target.value,
                                          }))
                                        }
                                        className="w-16 rounded-lg border border-slate-200 py-1.5 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                        placeholder="Cant."
                                      />
                                      <span className="text-slate-300">×</span>
                                      <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={draft.unitPrice}
                                        onChange={(e) =>
                                          setDraft((d) => ({
                                            ...d,
                                            unitPrice: e.target.value,
                                          }))
                                        }
                                        className="w-24 rounded-lg border border-slate-200 py-1.5 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                        placeholder="Precio"
                                      />
                                      <input
                                        type="date"
                                        value={draft.dueDate}
                                        onChange={(e) =>
                                          setDraft((d) => ({
                                            ...d,
                                            dueDate: e.target.value,
                                          }))
                                        }
                                        className="rounded-lg border border-slate-200 py-1.5 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1">
                                      <div className="text-sm text-slate-500">
                                        {line.orderQty}{' '}
                                        <span className="text-slate-300">×</span>{' '}
                                        ${money(line.unitPrice)}
                                      </div>

                                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <CalendarClock className="w-3.5 h-3.5" />
                                        {new Date(
                                          line.dueDate,
                                        ).toLocaleDateString('es-CO')}
                                      </div>

                                      {(line.receivedQty > 0 ||
                                        line.rejectedQty > 0) && (
                                        <div className="flex items-center gap-1.5">
                                          {line.receivedQty > 0 && (
                                            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                              Recibido {line.receivedQty}
                                            </span>
                                          )}
                                          {line.rejectedQty > 0 && (
                                            <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                              Rechazado {line.rejectedQty}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Total línea */}
                                  <div className="sm:w-28 text-right shrink-0">
                                    <p className="text-sm font-bold text-slate-900">
                                      ${money(line.lineTotal)}
                                    </p>
                                  </div>

                                  {/* Acciones */}
                                  <div className="flex items-center justify-end gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    {isEditingLine ? (
                                      <>
                                        <button
                                          onClick={() =>
                                            saveEditLine(
                                              po.purchaseOrderId,
                                              line.purchaseOrderDetailId,
                                            )
                                          }
                                          disabled={savingLine}
                                          className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                          title="Guardar"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={cancelEditLine}
                                          disabled={savingLine}
                                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                          title="Cancelar"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => startEditLine(line)}
                                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                          title="Editar línea"
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleRemoveLine(
                                              po.purchaseOrderId,
                                              line.purchaseOrderDetailId,
                                            )
                                          }
                                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                          title="Eliminar línea"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderTable;
