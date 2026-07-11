import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import mystKidsImg from "../../../assets/images/Mysterium Kids.png";
import luckyCapImg from "../../../assets/images/Lucky Captain.png";
import krakenAttImg from "../../../assets/images/Kraken Attack.png";
import sleepyCasImg from "../../../assets/images/Sleepy Castle.png";

export function useOwnerData() {
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [topGames, setTopGames] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  const [boardGames, setBoardGames] = useState<any[]>([]);
  const [rentGames, setRentGames] = useState<any[]>([]);
  const [fbMenu, setFbMenu] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchDbData();
  }, []);

  const fetchDbData = async () => {
    try {
      const { data: catData } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
      if (catData) setDbCategories(catData);

      const { data: bgData, error: bgError } = await supabase
        .from("boardgames")
        .select("*");
      if (bgError) throw bgError;
      if (bgData) {
        const mappedGames = bgData.map((g: any) => ({
          id: g.id,
          name: g.name,
          category: g.genre,
          stock: g.stock ?? 1,
          rented: g.rented ?? 0,
          price: g.price ?? 0,
          status:
            g.status === "Available"
              ? "Available"
              : g.status === "Maintenance"
                ? "Maintenance"
                : "In Use",
          active: g.active ?? g.status === "Available",
          image: g.image ?? "",
          emoji: g.emoji ?? "🎲",
          minPlayers: g.min_players ?? 2,
          maxPlayers: g.max_players ?? 6,
        }));
        setBoardGames(mappedGames);
        setRentGames(
          mappedGames.map((g: any) => ({
            id: `g_${g.id}`,
            name: g.name,
            price: g.price,
            category: g.category,
            emoji: g.emoji,
            image: g.image,
            status: g.status,
            active: g.active,
          })),
        );
        
        // Calculate Top Games
        const sortedGames = [...bgData]
          .sort((a, b) => (b.rented || 0) - (a.rented || 0))
          .slice(0, 4)
          .map((g, index) => ({
            rank: index + 1,
            name: g.name,
            plays: g.rented || 0,
            revenue: (g.rented || 0) * (g.price || 0),
            img: g.image || (index === 0 ? luckyCapImg : index === 1 ? mystKidsImg : index === 2 ? krakenAttImg : sleepyCasImg),
          }));
        setTopGames(sortedGames);
      }

      const { data: menuData, error: menuError } = await supabase
        .from("menus")
        .select("*");
      if (menuError) throw menuError;
      if (menuData) {
        setFbMenu(
          menuData.map((m: any) => ({
            id: m.id,
            name: m.name,
            price: m.price ?? 0,
            category: m.category,
            image: m.image ?? "",
            status: m.status === "Available" ? "In Stock" : "Out of Stock",
            active: m.status === "Available",
            sold: 0,
          })),
        );
      }

      // Fetch Recent Transactions
      const { data: txData, error: txError } = await supabase
        .from("dashboard_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (!txError && txData) {
        setRecentTransactions(
          txData.map((tx: any) => ({
            id: tx.id,
            customer: tx.customer_name || tx.customer || "Unknown",
            items: tx.items || "-",
            amount: tx.total_amount || tx.amount || 0,
            type: tx.type || (tx.fnb_total > 0 && tx.rental_total > 0 ? "Combo" : tx.rental_total > 0 ? "Rent" : "F&B"),
            time: "Baru saja", // ideally calculated from created_at
          }))
        );
      }

      // Fetch Active Sessions
      const { data: sessionData, error: sessionError } = await supabase
        .from("dashboard_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (!sessionError && sessionData) {
        setActiveSessions(
          sessionData.map((s: any) => ({
            id: s.id,
            customer: s.customer_name || s.customer || "-",
            table: s.table_number || s.table_name || "-",
            game: s.game_title || s.game || "-",
            duration: s.duration || "-",
            timeLeft: s.time_left || s.time_left || "-",
            status: s.status || "Active",
          }))
        );
      } else if (sessionError && sessionError.code === "42P01") {
        // Fallback dummy data if table does not exist yet (before SQL script is run)
        setActiveSessions([
          { id: 1, customer: "Andi Saputra", table: "Table A1", game: "Pandemic", duration: "2h 15m", timeLeft: "45m", status: "Active" },
          { id: 2, customer: "Budi Laksono", table: "Table B3", game: "Catan", duration: "1h 05m", timeLeft: "8m", status: "Ending Soon" }
        ]);
      }
    } catch (err) {
      console.error("Gagal mengambil data dari database:", err);
    }
  };

  const refreshDbData = async () => {
    await fetchDbData();
  };

  return {
    activeSessions,
    topGames,
    recentTransactions,
    boardGames,
    setBoardGames,
    rentGames,
    setRentGames,
    fbMenu,
    setFbMenu,
    dbCategories,
    refreshDbData,
  };
}
