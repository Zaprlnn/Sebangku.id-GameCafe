import { supabase } from "../../../lib/supabase";

// 1. Mencari pelanggan lama berdasarkan Nama atau No. HP (Fitur 2)
export async function searchCustomers(query: string) {
  if (!query) return { success: true, data: [] };
  
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%`); // Case-insensitive search

  if (error) {
    console.error("Error searching customers:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

// 2. Registrasi pelanggan baru (Fitur 2)
export async function registerCustomer(name: string, phone: string, email?: string) {
  const { data, error } = await supabase
    .from("customers")
    .insert([{ name, phone, email, join_date: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    console.error("Error registering customer:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}