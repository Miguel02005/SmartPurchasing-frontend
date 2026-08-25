'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ClipboardList,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Package,
  Trash2,
  Pencil,
  X,
  Check,
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { getToken } from '@/services/auth.service';
import { usePurchaseOrderStore } from '@/store/purchase-order.store';
import { PurchaseOrderDetail } from '@/types/purchase-order.types';
import AppHeader from '@/components/AppHeader';

const STATUS_LABELS: Record<number, { label: string; className: string }> = {
  1: { label: 'Pending', className: 'bg-amber-50 text-amber-700' },
  2: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700' },
  3: { label: 'Rejected', className: 'bg-red-50 text-red-700' },
  4: { label: 'Complete', className: 'bg-blue-50 text-blue-700' },
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

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const purchaseOrderId = Number(params.id);

  const { isAuthenticated, isLoading } = useAuth();
  const {
    selectedPurchaseOrder: order,
    loading,
    error,
    fetchPurchaseOrder,
    updateDetailLine,
    removeDetailLine,
    clearSelected,
  } = usePurchaseOrderStore();

  const [successMessage, setSuccessMessage] = useState('');
  const [lineError, setLineError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<EditDraft>({
    orderQty: '',
    unitPrice: '',
    dueDate: '',
  });
  const [savingLine, setSavingLine] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !purchaseOrderId) return;
    const token = getToken();
    if (!token) return;
    fetchPurchaseOrder(purchaseOrderId, token);
    return () => clearSelected();
  }, [isAuthenticated, purchaseOrderId, fetchPurchaseOrder, clearSelected]);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const startEdit = (line: PurchaseOrderDetail) => {
    setLineError('');
    setEditingId(line.purchaseOrderDetailId);
    setDraft({
      orderQty: String(line.orderQty),
      unitPrice: String(line.unitPrice),
      dueDate: line.dueDate.slice(0, 10),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setLineError('');
  };

  const saveEdit = async (purchaseOrderDetailId: number) => {
    const token = getToken();
    if (!token) return;

    setSavingLine(true);
    setLineError('');
    try {
      await updateDetailLine(
        purchaseOrderId,
        purchaseOrderDetailId,
        {
          orderQty: Number(draft.orderQty),
          unitPrice: Number(draft.unitPrice),
          dueDate: draft.dueDate || undefined,
        },
        token,
      );
      setSuccessMessage('Línea actualizada correctamente');
      setEditingId(null);
    } catch (err) {
      setLineError(
        err instanceof Error ? err.message : 'No se pudo actualizar la línea',
      );
    } finally {
      setSavingLine(false);
    }
  };

  const handleRemoveLine = async (purchaseOrderDetailId: number) => {
    const token = getToken();
    if (!token) return;
    if (!confirm('¿Eliminar esta línea de la orden?')) return;

    setLineError('');
    try {
      await removeDetailLine(purchaseOrderId, purchaseOrderDetailId, token);
      setSuccessMessage('Línea eliminada correctamente');
    } catch (err) {
      setLineError(
        err instanceof Error ? err.message : 'No se pudo eliminar la línea',
      );
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Cargando orden...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-600">{error || 'Orden no encontrada'}</p>
          <button
            onClick={() => router.push('/purchase-orders')}
            className="mt-6 text-sm font-medium text-blue-600 hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const status = STATUS_LABELS[order.status] ?? {
    label: 'Desconocido',
    className: 'bg-slate-100 text-slate-600',
  };
  const details = order.details ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => router.push('/purchase-orders')}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a órdenes
        </button>

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">
              {successMessage}
            </p>
          </div>
        )}

        {lineError && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-medium text-red-700">{lineError}</p>
          </div>
        )}

        {/* HEADER DE LA ORDEN */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  PO-{order.purchaseOrderId}
                </h1>
                <p className="text-xs text-slate-400">
                  Rev. {order.revisionNumber} · Método envío #
                  {order.shipMethodId}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex self-start sm:self-auto items-center rounded-lg px-3 py-1.5 text-sm font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400 mb-1">Fecha de orden</p>
              <p className="text-sm font-medium text-slate-800">
                {new Date(order.orderDate).toLocaleDateString('es-CO')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Fecha de envío</p>
              <p className="text-sm font-medium text-slate-800">
                {order.shipDate
                  ? new Date(order.shipDate).toLocaleDateString('es-CO')
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Líneas</p>
              <p className="text-sm font-medium text-slate-800">
                {details.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Total</p>
              <p className="text-sm font-semibold text-slate-900">
                ${money(order.totalDue)}
              </p>
            </div>
          </div>
        </section>

        {/* LÍNEAS DE DETALLE */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">
              Productos en esta orden
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cantidades, precios unitarios y totales por línea.
            </p>
          </div>

          {details.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-center">
              <Package className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">
                Esta orden todavía no tiene productos agregados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Precio unitario
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Total línea
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Fecha de entrega
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((line) => {
                    const isEditing = editingId === line.purchaseOrderDetailId;

                    return (
                      <tr
                        key={line.purchaseOrderDetailId}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">
                            Producto #{line.productId}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          {isEditing ? (
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
                              className="w-20 rounded border border-slate-200 py-1 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-sm text-slate-600">
                              {line.orderQty}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {isEditing ? (
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
                              className="w-24 rounded border border-slate-200 py-1 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-sm text-slate-600">
                              ${money(line.unitPrice)}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                          ${money(line.lineTotal)}
                        </td>

                        <td className="px-4 py-4">
                          {isEditing ? (
                            <input
                              type="date"
                              value={draft.dueDate}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  dueDate: e.target.value,
                                }))
                              }
                              className="rounded border border-slate-200 py-1 px-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-sm text-slate-600">
                              {new Date(line.dueDate).toLocaleDateString(
                                'es-CO',
                              )}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() =>
                                  saveEdit(line.purchaseOrderDetailId)
                                }
                                disabled={savingLine}
                                className="w-9 h-9 flex items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                title="Guardar"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={savingLine}
                                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                title="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => startEdit(line)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Editar línea"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveLine(line.purchaseOrderDetailId)
                                }
                                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Eliminar línea"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* TOTALES */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Resumen de totales
          </h2>
          <div className="space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-800 font-medium">
                ${money(order.subTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Impuesto</span>
              <span className="text-slate-800 font-medium">
                ${money(order.taxAmt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Flete</span>
              <span className="text-slate-800 font-medium">
                ${money(order.freight)}
              </span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-bold text-slate-900">
                ${money(order.totalDue)}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
