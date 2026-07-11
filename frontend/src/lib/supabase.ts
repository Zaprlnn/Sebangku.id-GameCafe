import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Tempelkan console.log ini sementara untuk memastikan nilainya tidak undefined saat aplikasi di-refresh
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key Existing:", !!supabaseAnonKey); 

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Variabel environment Supabase belum terkonfigurasi dengan benar di file .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);