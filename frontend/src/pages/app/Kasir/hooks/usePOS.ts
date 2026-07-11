// src/pages/app/Kasir/hooks/usePOS.ts
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const usePOS = () => {
  const [cart, setCart] = useState<{ menu_id: number; qty: number; price: number }[]>([]);

  const handleCheckout = async (customerId: number, paymentMethod: 'Cash' | 'Transfer', totalAmount: number) => {
    if (!customerId || cart.length === 0) return { success: false, error: 'Customer atau keranjang kosong' };

    // 1. Insert ke tabel transactions
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([
        { 
          customer_id: customerId, 
          total: totalAmount, 
          payment_method: paymentMethod 
        }
      ])
      .select()
      .single();

    if (txError) return { success: false, error: txError.message };

    // 2. Siapkan data detail untuk bulk insert ke transaction_details
    const detailsData = cart.map(item => ({
      transaction_id: transaction.id,
      menu_id: item.menu_id,
      qty: item.qty,
      price: item.price
    }));

    // 3. Insert ke tabel transaction_details
    const { error: detailError } = await supabase
      .from('transaction_details')
      .insert(detailsData);

    if (detailError) return { success: false, error: detailError.message };

    // Clear cart setelah sukses
    setCart([]);
    return { success: true, transactionId: transaction.id };
  };

  return { cart, setCart, handleCheckout };
};