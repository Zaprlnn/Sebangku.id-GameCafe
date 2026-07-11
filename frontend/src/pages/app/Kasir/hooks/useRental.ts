// Fungsi di dalam hook useRental.ts untuk handle start session
import { supabase } from "@/lib/supabase";


const startRentalSession = async (customerId: number, boardgameId: number, durationMinutes: number, priceId: number) => {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

  const { data, error } = await supabase
    .from('game_sessions')
    .insert([
      {
        customer_id: customerId,
        boardgame_id: boardgameId,
        rental_pricing_id: priceId, // Relasi ke tabel rental_pricing sesuai schema gambar Anda
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationMinutes,
        status: 'Active'
      }
    ]);

  return { data, error };
};