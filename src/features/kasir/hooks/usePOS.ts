import { useState } from "react";
import { checkoutPOS } from "../services/posService";

export interface CartItem {
  menu_id: number;
  name: string;
  price: number;
  qty: number;
}

export function usePOS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: number | string; name: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Transfer">("Cash"); // Default sesuai MVP [cite: 29]
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Tambah item ke keranjang atau tambah qty jika item sudah ada 
  const addToCart = (menu: { id: number; name: string; price: number }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.menu_id === menu.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.menu_id === menu.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { menu_id: menu.id, name: menu.name, price: menu.price, qty: 1 }];
    });
  };

  // 2. Update kuantitas (qty) item secara spesifik 
  const updateQty = (menuId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(menuId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.menu_id === menuId ? { ...item, qty: newQty } : item))
    );
  };

  // 3. Hapus item dari keranjang 
  const removeFromCart = (menuId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.menu_id !== menuId));
  };

  // 4. Kalkulasi Subtotal & Total Belanja [cite: 30]
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 5. Fungsi kirim data transaksi ke Supabase [cite: 26]
  const handleCheckout = async () => {
    if (cart.length === 0) return { success: false, error: "Keranjang masih kosong" };
    
    setIsSubmitting(true);
    const customerId = selectedCustomer ? selectedCustomer.id : null;
    
    const result = await checkoutPOS(customerId, totalAmount, paymentMethod, cart);
    
    if (result.success) {
      setCart([]); // Reset keranjang setelah sukses 
    }
    setIsSubmitting(false);
    return result;
  };

  return {
    cart,
    selectedCustomer,
    setSelectedCustomer,
    paymentMethod,
    setPaymentMethod,
    totalAmount,
    isSubmitting,
    addToCart,
    updateQty,
    removeFromCart,
    handleCheckout,
  };
}