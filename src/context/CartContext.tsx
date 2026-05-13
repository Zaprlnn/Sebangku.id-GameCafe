import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  cartId: string;   // unique per cart slot
  id: string;       // menu item id
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartId" | "qty">) => void;
  increment: (cartId: string) => void;
  decrement: (cartId: string) => void;
  remove: (cartId: string) => void;
  clearCart: () => void;
  note: string;
  setNote: (n: string) => void;
  totalItems: number;
  totalPrice: number;
  estimatedPoints: number;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [note, setNote] = useState("");

  const addItem = useCallback((item: Omit<CartItem, "cartId" | "qty">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, cartId: `cart_${item.id}_${Date.now()}`, qty: 1 }];
    });
  }, []);

  const increment = useCallback((cartId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i))
    );
  }, []);

  const decrement = useCallback((cartId: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.cartId === cartId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const remove = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setNote("");
  }, []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const estimatedPoints = Math.floor(totalPrice / 2_000);

  return (
    <CartContext.Provider
      value={{
        items, addItem, increment, decrement, remove, clearCart,
        note, setNote,
        totalItems, totalPrice, estimatedPoints,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
