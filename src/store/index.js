import { create } from "zustand";

export const useStore = create((set) => ({
  //cart
  cart: JSON.parse(localStorage.getItem("cart")) ?? [],
  addToCart: (id) =>
    set((state) => {
      const index = state.cart.findIndex((item) => item.id === id);
      if (index !== -1) {
        return {
          ...state,
          cart: state.cart.map((item, idx) =>
            idx === index ? { ...item, count: item.count + 1 } : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { id, count: 1 }],
        };
      }
    }),
  incrementCount: (id) =>
    set((state) => ({
      ...state,
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      ),
    })),
  decrementCount: (id) =>
    set((state) => ({
      ...state,
      cart: state.cart
        .map((item) =>
          item.id === id ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0),
    })),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}));
