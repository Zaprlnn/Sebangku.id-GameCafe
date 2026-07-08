import { useState, useEffect } from "react";
import { getActiveSessions, startRental } from "../services/rentalService";

export interface LiveSession {
  id: number;
  customerName: string;
  boardgameTitle: string;
  endTime: Date;
  timeLeftMinutes: number;
  isNearEnd: boolean; // True jika waktu bermain < 10 menit 
}

export function useRental() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Ambil sesi aktif dari Supabase dan konversi ke data tracking real-time 
  const loadActiveSessions = async () => {
    setIsLoading(true);
    const result = await getActiveSessions();
    if (result.success && result.data) {
      const mapped = result.data.map((sess: any) => {
        const end = new Date(sess.end_time);
        const now = new Date();
        const diffMs = end.getTime() - now.getTime();
        const diffMins = Math.max(0, Math.floor(diffMs / 60000));

        return {
          id: sess.id,
          customerName: sess.customers?.name || "Anonymous",
          boardgameTitle: sess.boardgames?.title || "Unknown Game",
          endTime: end,
          timeLeftMinutes: diffMins,
          isNearEnd: diffMins <= 10 && diffMins > 0, // Alarm/notifikasi 10 menit sebelum berakhir 
        };
      });
      setSessions(mapped);
    }
    setIsLoading(false);
  };

  // 2. Efek untuk menjalankan countdown timer setiap 1 menit sekali secara real-time 
  useEffect(() => {
    loadActiveSessions(); // Ambil data awal saat komponen diload

    const interval = setInterval(() => {
      setSessions((prevSessions) =>
        prevSessions.map((sess) => {
          const now = new Date();
          const diffMs = sess.endTime.getTime() - now.getTime();
          const diffMins = Math.max(0, Math.floor(diffMs / 60000));
          
          return {
            ...sess,
            timeLeftMinutes: diffMins,
            isNearEnd: diffMins <= 10 && diffMins > 0, // Notifikasi 10 menit sebelum selesai 
          };
        })
      );
    }, 60000); // Update setiap 60 detik

    return () => clearInterval(interval);
  }, []);

  // 3. Fungsi membuka sewa durasi baru (pilihan: 60 mnt, 180 mnt, atau 480 mnt/all day) 
  const createRentalSession = async (customerId: number | string, boardgameId: number, durationType: "1_hour" | "3_hours" | "all_day") => {
    let minutes = 60;
    let cost = 15000; // Contoh skema harga standar per jam

    if (durationType === "3_hours") {
      minutes = 180;
      cost = 40000; // Paket hemat 3 jam
    } else if (durationType === "all_day") {
      minutes = 480; // Estimasi batas maksimal waktu operasional
      cost = 75000;
    }

    const result = await startRental(customerId, boardgameId, minutes, cost);
    if (result.success) {
      await loadActiveSessions(); // Refresh list agar timer baru langsung muncul 
    }
    return result;
  };

  return {
    sessions,
    isLoading,
    refreshSessions: loadActiveSessions,
    createRentalSession,
  };
}