import { create } from 'zustand';
import {
  PurchaseOrder,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  UpdatePurchaseOrderDetailDto,
} from '@/types/purchase-order.types';
import {
  getMyPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  updatePurchaseOrderDetail,
  removePurchaseOrderDetail,
} from '@/services/purchase-order.service';

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[];
  selectedPurchaseOrder: PurchaseOrder | null;
  loading: boolean;
  error: string;

  fetchMyPurchaseOrders: (token: string) => Promise<void>;
  fetchPurchaseOrder: (purchaseOrderId: number, token: string) => Promise<void>;
  createPurchaseOrder: (
    dto: CreatePurchaseOrderDto,
    token: string,
  ) => Promise<PurchaseOrder>;
  updatePurchaseOrder: (
    purchaseOrderId: number,
    dto: UpdatePurchaseOrderDto,
    token: string,
  ) => Promise<PurchaseOrder>;
  updateDetailLine: (
    purchaseOrderId: number,
    purchaseOrderDetailId: number,
    dto: UpdatePurchaseOrderDetailDto,
    token: string,
  ) => Promise<void>;
  removeDetailLine: (
    purchaseOrderId: number,
    purchaseOrderDetailId: number,
    token: string,
  ) => Promise<void>;
  clearSelected: () => void;
}

export const usePurchaseOrderStore = create<PurchaseOrderState>((set, get) => ({
  purchaseOrders: [],
  selectedPurchaseOrder: null,
  loading: false,
  error: '',

  fetchMyPurchaseOrders: async (token: string) => {
    set({ loading: true, error: '' });
    try {
      const purchaseOrders = await getMyPurchaseOrders(token);
      set({ purchaseOrders, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar las órdenes',
        loading: false,
      });
    }
  },

  fetchPurchaseOrder: async (purchaseOrderId: number, token: string) => {
    set({ loading: true, error: '' });
    try {
      const purchaseOrder = await getPurchaseOrder(purchaseOrderId, token);
      set({ selectedPurchaseOrder: purchaseOrder, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al cargar la orden',
        loading: false,
      });
    }
  },

  createPurchaseOrder: async (dto: CreatePurchaseOrderDto, token: string) => {
    set({ error: '' });
    const newPurchaseOrder = await createPurchaseOrder(dto, token);
    set({ purchaseOrders: [...get().purchaseOrders, newPurchaseOrder] });
    return newPurchaseOrder;
  },

  updatePurchaseOrder: async (
    purchaseOrderId: number,
    dto: UpdatePurchaseOrderDto,
    token: string,
  ) => {
    set({ error: '' });
    const updated = await updatePurchaseOrder(purchaseOrderId, dto, token);
    set({
      purchaseOrders: get().purchaseOrders.map((po) =>
        po.purchaseOrderId === purchaseOrderId ? updated : po,
      ),
      selectedPurchaseOrder:
        get().selectedPurchaseOrder?.purchaseOrderId === purchaseOrderId
          ? updated
          : get().selectedPurchaseOrder,
    });
    return updated;
  },

  // El backend recalcula subTotal en el servidor al editar/eliminar una
  // línea, así que después de cada operación volvemos a pedir la orden
  // completa (fetchPurchaseOrder) para traer los totales ya actualizados
  // en vez de intentar recalcularlos nosotros en el cliente.
  updateDetailLine: async (
    purchaseOrderId: number,
    purchaseOrderDetailId: number,
    dto: UpdatePurchaseOrderDetailDto,
    token: string,
  ) => {
    set({ error: '' });
    await updatePurchaseOrderDetail(
      purchaseOrderId,
      purchaseOrderDetailId,
      dto,
      token,
    );
    await get().fetchPurchaseOrder(purchaseOrderId, token);
  },

  removeDetailLine: async (
    purchaseOrderId: number,
    purchaseOrderDetailId: number,
    token: string,
  ) => {
    set({ error: '' });
    await removePurchaseOrderDetail(purchaseOrderId, purchaseOrderDetailId, token);
    await get().fetchPurchaseOrder(purchaseOrderId, token);
  },

  clearSelected: () => set({ selectedPurchaseOrder: null }),
}));