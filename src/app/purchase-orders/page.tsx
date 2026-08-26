'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Plus, AlertCircle, X, CheckCircle2 } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { getToken } from '@/services/auth.service';
import { usePurchaseOrderStore } from '@/store/purchase-order.store';
import {
  PurchaseOrder,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from '@/types/purchase-order.types';

import PurchaseOrderTable from '@/components/PurchaseOrderTable';
import PurchaseOrderForm from '@/components/PurchaseOrderForm';
import AppHeader from '@/components/AppHeader';

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const {
    purchaseOrders,
    loading: loadingOrders,
    error,
    fetchMyPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    updateDetailLine,
    removeDetailLine,
  } = usePurchaseOrderStore();

  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = getToken();
    if (!token) return;
    fetchMyPurchaseOrders(token);
  }, [isAuthenticated, fetchMyPurchaseOrders]);

  const openCreateModal = () => {
    setEditingOrder(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditModal = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setFormError('');
    setShowForm(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowForm(false);
    setEditingOrder(null);
    setFormError('');
  };

  const handleSubmit = async (
    dto: CreatePurchaseOrderDto | UpdatePurchaseOrderDto,
  ) => {
    const token = getToken();
    if (!token) return;

    setSubmitting(true);
    setFormError('');

    try {
      if (editingOrder) {
        await updatePurchaseOrder(
          editingOrder.purchaseOrderId,
          dto as UpdatePurchaseOrderDto,
          token,
        );
        setSuccessMessage(
          `Orden PO-${editingOrder.purchaseOrderId} actualizada correctamente`,
        );
      } else {
        const created = await createPurchaseOrder(
          dto as CreatePurchaseOrderDto,
          token,
        );
        setSuccessMessage(`Orden PO-${created.purchaseOrderId} creada correctamente`);
      }
      setShowForm(false);
      setEditingOrder(null);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Error al guardar la orden',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handlers para el acordeón de líneas dentro de PurchaseOrderTable.
  // El store ya se encarga de refrescar el listado completo después.
  const handleUpdateLine = async (
    purchaseOrderId: number,
    purchaseOrderDetailId: number,
    dto: { orderQty?: number; unitPrice?: number; dueDate?: string },
  ) => {
    const token = getToken();
    if (!token) return;
    await updateDetailLine(purchaseOrderId, purchaseOrderDetailId, dto, token);
    setSuccessMessage('Línea actualizada correctamente');
  };

  const handleRemoveLine = async (
    purchaseOrderId: number,
    purchaseOrderDetailId: number,
  ) => {
    const token = getToken();
    if (!token) return;
    await removeDetailLine(purchaseOrderId, purchaseOrderDetailId, token);
    setSuccessMessage('Línea eliminada correctamente');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Cargando SmartPurchasing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-10">
          {/* HERO */}
          <section className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-blue-800" />
                  </div>
                  <span className="text-xs font-semibold tracking-[0.18em] text-blue-800 uppercase">
                    Tus órdenes de compra
                  </span>
                </div>

                <p className="mt-2 text-slate-500 max-w-xl">
                  Crea, revisa y actualiza el estado de tus órdenes de
                  compra. Haz clic en una orden para ver sus productos.
                </p>
              </div>

              <button
                onClick={openCreateModal}
                className="
                  inline-flex items-center justify-center gap-2
                  h-11 px-5
                  rounded-xl
                  bg-[#164b8a]
                  text-white
                  font-medium
                  hover:bg-[#0f3a6e]
                  transition-colors
                  self-start
                "
              >
                <Plus className="w-4 h-4" />
                Nueva orden
              </button>
            </div>
          </section>

          {successMessage && (
            <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium text-emerald-800">
                {successMessage}
              </p>
            </div>
          )}

          {/* LISTADO */}
          <section>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Órdenes</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Consulta y administra tus órdenes de compra.
                </p>
              </div>

              <div className="p-4">
                {loadingOrders ? (
                  <div className="py-16 flex flex-col items-center justify-center">
                    <p className="text-sm text-slate-500">
                      Cargando órdenes...
                    </p>
                  </div>
                ) : error ? (
                  <div className="py-10 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                ) : purchaseOrders.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <ClipboardList className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="mt-4 font-semibold text-slate-800">
                      Todavía no tienes órdenes de compra
                    </h3>
                    <p className="mt-1 text-sm text-slate-400 max-w-sm">
                      Crea tu primera orden para empezar.
                    </p>
                    <button
                      onClick={openCreateModal}
                      className="
                        mt-5
                        inline-flex items-center gap-2
                        rounded-xl
                        bg-[#164b8a]
                        px-4 py-2.5
                        text-sm font-medium
                        text-white
                        hover:bg-[#0f3a6e]
                        transition-colors
                      "
                    >
                      <Plus className="w-4 h-4" />
                      Nueva orden
                    </button>
                  </div>
                ) : (
                  <PurchaseOrderTable
                    purchaseOrders={purchaseOrders}
                    onEdit={openEditModal}
                    onUpdateLine={handleUpdateLine}
                    onRemoveLine={handleRemoveLine}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* MODAL CREAR/EDITAR CABECERA */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div
            className="
              relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto
              bg-white rounded-2xl border border-slate-200 shadow-2xl
            "
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingOrder ? 'Editar orden' : 'Nueva orden'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingOrder
                    ? `PO-${editingOrder.purchaseOrderId}`
                    : 'Completa los datos de la cabecera.'}
                </p>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={closeModal}
                className="
                  w-9 h-9 rounded-lg flex items-center justify-center
                  text-slate-400 hover:text-slate-700 hover:bg-slate-100
                  transition-colors disabled:opacity-50
                "
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    No se pudo guardar la orden
                  </p>
                  <p className="text-sm text-red-600 mt-0.5">{formError}</p>
                </div>
              </div>
            )}

            <div className="p-6">
              <PurchaseOrderForm
                mode={editingOrder ? 'edit' : 'create'}
                initialData={editingOrder}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
