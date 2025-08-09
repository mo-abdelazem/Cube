import { create } from 'zustand';

type CartItem = {
  id: string;
  productId: string;
  productVariantId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  getCount: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch('/api/bff/cart', { cache: 'no-store', credentials: 'include', });

      if (!res.ok) {
        const msg = `Cart fetch failed (${res.status})`;
        set({ error: msg, loading: false });
        return;
      }

      const data = await res.json();
      set({ items: data.items || [], loading: false, error: null });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      set({ error: 'Network error', loading: false });
    }
  },

  getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
