"use client";
import { create } from "zustand";

export type CartItem = { product_id: number; name: string; price_tjs: number; qty: number };

type State = {
  phone: string;
  setPhone: (v: string) => void;

  cart: CartItem[];
  add: (it: Omit<CartItem, "qty">) => void;
  inc: (product_id: number) => void;
  dec: (product_id: number) => void;
  clear: () => void;
};

export const useAppStore = create<State>((set, get) => ({
  phone: "",
  setPhone: (v) => set({ phone: v }),

  cart: [],
  add: (it) => {
    const cart = [...get().cart];
    const idx = cart.findIndex((x) => x.product_id === it.product_id);
    if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + 1 };
    else cart.push({ ...it, qty: 1 });
    set({ cart });
  },
  inc: (id) => set({ cart: get().cart.map((x) => (x.product_id === id ? { ...x, qty: x.qty + 1 } : x)) }),
  dec: (id) =>
    set({
      cart: get().cart
        .map((x) => (x.product_id === id ? { ...x, qty: Math.max(0, x.qty - 1) } : x))
        .filter((x) => x.qty > 0),
    }),
  clear: () => set({ cart: [] }),
}));
