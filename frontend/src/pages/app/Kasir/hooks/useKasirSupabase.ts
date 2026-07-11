// src/pages/app/Kasir/hooks/useKasirSupabase.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Customer {
  id: number;
  name: string;
  phone?: string;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  category?: string;
}

export interface Boardgame {
  id: number;
  title: string;
  rental_pricing?: { id: number; duration_minutes: number; price: number }[];
}

export interface GameSession {
  id: number;
  status: string;
  start_time: string;
  end_time: string;
  customers?: { name: string };
  boardgames?: { title: string };
}

export const useKasirSupabase = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [boardgames, setBoardgames] = useState<Boardgame[]>([]);
  const [activeSessions, setActiveSessions] = useState<GameSession[]>([]);

  // Fetch all data on mount
  useEffect(() => {
    fetchCustomers();
    fetchMenus();
    fetchBoardgames();
    fetchActiveSessions();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('name');
    if (data) setCustomers(data);
  };

  const fetchMenus = async () => {
    const { data } = await supabase.from('menus').select('*').order('name');
    if (data) setMenus(data);
  };

  const fetchBoardgames = async () => {
    const { data } = await supabase
      .from('boardgames')
      .select('*, rental_pricing(*)');
    if (data) setBoardgames(data);
  };

  const fetchActiveSessions = async () => {
    const { data } = await supabase
      .from('game_sessions')
      .select('*, customers(name), boardgames(title)')
      .eq('status', 'Active');
    if (data) setActiveSessions(data);
  };

  // Create a new customer and refresh list
  const createNewCustomer = async (name: string, phone: string) => {
    const { data, error } = await supabase
      .from("customers")
      .insert([{ 
        name: name, 
        phone: phone,
        email: "", // Mengirim teks kosong agar kolom email 'Not Null' tidak protes
        join_date: new Date().toISOString() // Otomatis mengisi waktu hari ini dari aplikasi
      }])
      .select()
      .single();
      
    if (error) throw error;
    await fetchCustomers(); 
    return data;
  };

  // Checkout POS: insert transaction + details
  const handleCheckoutPOS = async (
    customerId: number,
    cart: { menu_id: number; qty: number; price: number }[],
    paymentMethod: 'Cash' | 'Transfer'
  ) => {
    const totalAmount = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([{ customer_id: customerId, total: totalAmount, payment_method: paymentMethod }])
      .select()
      .single();

    if (txError) return { success: false, error: txError.message };

    const details = cart.map(item => ({
      transaction_id: transaction.id,
      menu_id: item.menu_id,
      qty: item.qty,
      price: item.price,
    }));

    const { error: detailError } = await supabase
      .from('transaction_details')
      .insert(details);

    if (detailError) return { success: false, error: detailError.message };
    return { success: true };
  };

  // Start a rental session and refresh active sessions
  const handleStartRental = async (
    customerId: number,
    boardgameId: number,
    durationMinutes: number,
    priceId: number
  ) => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const { error } = await supabase.from('game_sessions').insert([
      {
        customer_id: customerId,
        boardgame_id: boardgameId,
        rental_pricing_id: priceId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationMinutes,
        status: 'Active',
      },
    ]);

    if (!error) fetchActiveSessions();
    return { error };
  };

  return {
    customers,
    menus,
    boardgames,
    activeSessions,
    createNewCustomer,
    handleCheckoutPOS,
    handleStartRental,
  };
};
