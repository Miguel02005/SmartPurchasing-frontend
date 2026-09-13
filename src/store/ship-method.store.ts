import { create } from 'zustand';
import { ShipMethod } from '@/types/ship-method.types';
import { getShipMethods } from '@/services/ship-method.service';

interface ShipMethodState {
  shipMethods: ShipMethod[];
  loading: boolean;
  error: string;
  fetched: boolean;

  fetchShipMethods: (token: string) => Promise<void>;
}

export const useShipMethodStore = create<ShipMethodState>((set, get) => ({
  shipMethods: [],
  loading: false,
  error: '',
  fetched: false,

  // El catálogo de métodos de envío casi no cambia, así que si ya lo
  // trajimos una vez en esta sesión no lo volvemos a pedir (evita
  // llamadas repetidas cada vez que se abre el modal de crear orden).
  fetchShipMethods: async (token: string) => {
    if (get().fetched || get().loading) return;

    set({ loading: true, error: '' });
    try {
      const shipMethods = await getShipMethods(token);
      set({ shipMethods, loading: false, fetched: true });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : 'Error al cargar los métodos de envío',
        loading: false,
      });
    }
  },
}));
