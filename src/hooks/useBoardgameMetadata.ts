/**
 * useBoardgameMetadata Hook
 * Mengambil data boardgame_metadata dari Supabase.
 *
 * Penggunaan:
 *   import { useBoardgameMetadata } from "@/hooks/useBoardgameMetadata";
 *   const { data, loading, error } = useBoardgameMetadata();
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BOARDGAMES_SEED, type BoardGameSeed } from "@/data/boardgames_seed";

export interface BoardgameMetadata extends BoardGameSeed {
  id: number;
  created_at?: string;
}

export function useBoardgameMetadata() {
  const [data, setData] = useState<BoardgameMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      const { data: rows, error: err } = await supabase
        .from("boardgame_metadata")
        .select("*")
        .order("id", { ascending: true });

      if (err) {
        console.warn("Supabase error, menggunakan fallback seed data:", err.message);
        // Fallback ke seed data lokal jika Supabase belum tersedia
        const fallback = BOARDGAMES_SEED.map((g, i) => ({
          id: i + 1,
          ...g,
        }));
        setData(fallback);
        setError(err.message);
      } else {
        setData(rows as BoardgameMetadata[]);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

/**
 * Contoh query langsung via supabase client (tanpa hook):
 *
 * // Ambil semua
 * const { data } = await supabase.from("boardgame_metadata").select("*");
 *
 * // Filter berdasarkan type
 * const { data } = await supabase.from("boardgame_metadata").select("*").eq("type", "Family");
 *
 * // Filter berdasarkan category
 * const { data } = await supabase.from("boardgame_metadata").select("*").eq("category", "Puzzle");
 *
 * // Filter berdasarkan usia
 * const { data } = await supabase.from("boardgame_metadata").select("*").lte("jumlah_pemain_min", 2);
 */
