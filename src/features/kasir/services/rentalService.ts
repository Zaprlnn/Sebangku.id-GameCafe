import { supabase } from "../../../lib/supabase";

/**
 * 1. MENGAMBIL DAFTAR SESI SEWA AKTIF
 * Digunakan untuk menampilkan dashboard sesi aktif secara real-time (Live Running Timer)
 * Berdasarkan Fitur 5: Menampilkan Nama Pelanggan, Judul Game, & Running Timer
 */
export async function getActiveSessions() {
  const { data, error } = await supabase
    .from("game_sessions")
    .select(`
      id, 
      start_time, 
      end_time, 
      duration, 
      cost, 
      status,
      customers ( id, name ),
      boardgames ( id, title )
    `)
    .eq("status", "Active"); // Mengambil yang statusnya masih 'Active'

  if (error) {
    console.error("Error fetching active sessions:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

/**
 * 2. MEMULAI SESI SEWA BARU
 * Digunakan saat kasir mengaktifkan durasi sewa (1 jam, 3 jam, atau all day)
 * Mengotomatisasi perhitungan end_time serta mengubah status fisik game menjadi 'In Use'
 */
export async function startRental(
  customerId: number | string, 
  boardgameId: number | string, 
  durationMinutes: number, 
  cost: number
) {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000); // Hitung end_time otomatis

  // Langkah A: Masukkan data sesi baru ke tabel game_sessions
  const { data, error: sessionError } = await supabase
    .from("game_sessions")
    .insert([{
      customer_id: customerId,
      boardgame_id: boardgameId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration: durationMinutes,
      cost,
      status: "Active" // Default sesi baru adalah 'Active'
    }])
    .select()
    .single();

  if (sessionError) {
    console.error("Error starting rental session:", sessionError.message);
    return { success: false, error: sessionError.message };
  }

  // Langkah B: Ubah status fisik boardgame terkait menjadi 'In Use'
  const { error: bgError } = await supabase
    .from("boardgames")
    .update({ status: "In Use" })
    .eq("id", boardgameId);

  if (bgError) {
    console.error("Warning: Gagal memperbarui status boardgame menjadi In Use:", bgError.message);
  }

  return { success: true, data };
}

/**
 * 3. MENGHENTIKAN SESI SEWA (Penyempurnaan Fitur 5)
 * Diperlukan agar kasir memiliki kontrol penuh untuk menghentikan waktu (timer) secara manual
 * Mengubah status sesi menjadi 'Completed' dan mengembalikan status game menjadi 'Available'
 */
export async function endRentalSession(
  sessionId: number | string, 
  boardgameId: number | string
) {
  // Langkah A: Update status sesi sewa di database menjadi 'Completed'
  const { error: sessionError } = await supabase
    .from("game_sessions")
    .update({ 
      status: "Completed", 
      end_time: new Date().toISOString() // Catat waktu asli saat kasir klik stop
    })
    .eq("id", sessionId);

  if (sessionError) {
    console.error("Gagal menghentikan sesi sewa:", sessionError.message);
    return { success: false, error: sessionError.message };
  }

  // Langkah B: Kembalikan status fisik boardgame menjadi 'Available' agar siap disewa kembali
  const { error: bgError } = await supabase
    .from("boardgames")
    .update({ status: "Available" })
    .eq("id", boardgameId);

  if (bgError) {
    console.error("Warning: Gagal mengembalikan status boardgame menjadi Available:", bgError.message);
    return { success: false, error: bgError.message };
  }

  return { success: true };
}