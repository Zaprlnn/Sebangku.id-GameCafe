import { supabase } from "../../../lib/supabase";

// 1. Ambil semua menu makanan & minuman untuk dipajang di POS
export async function getMenuList() {
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching menus:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

// 2. Simpan transaksi POS (Transaksi Utama + Detail Item)
export async function checkoutPOS(customerId: number | string | null, total: number, paymentMethod: string, cartItems: { menu_id: number; qty: number; price: number }[]) {
  // Insert data ke tabel 'transactions' terlebih dahulu
  const { data: transactionData, error: txError } = await supabase
    .from("transactions")
    .insert([{ customer_id: customerId, total, payment_method: paymentMethod }])
    .select()
    .single();

  if (txError) {
    console.error("Error creating transaction:", txError.message);
    return { success: false, error: txError.message };
  }

  // Siapkan data detail item dengan memasukkan ID transaksi yang baru saja terbuat
  const detailsPayload = cartItems.map((item) => ({
    transaction_id: transactionData.id,
    menu_id: item.menu_id,
    qty: item.qty,
    price: item.price,
  }));

  // Insert banyak item sekaligus ke tabel 'transaction_details'
  const { error: detailsError } = await supabase
    .from("transaction_details")
    .insert(detailsPayload);

  if (detailsError) {
    console.error("Error saving transaction details:", detailsError.message);
    return { success: false, error: detailsError.message };
  }

  return { success: true, transactionId: transactionData.id };
}