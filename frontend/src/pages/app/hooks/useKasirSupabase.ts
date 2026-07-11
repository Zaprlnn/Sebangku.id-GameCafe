import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 

export function useKasirSupabase() {
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [dbSessions, setDbSessions] = useState<any[]>([]);
  const [dbBoardgames, setDbBoardgames] = useState<any[]>([]);
  const [dbMenus, setDbMenus] = useState<any[]>([]); 
  const [dbTransactions, setDbTransactions] = useState<any[]>([]); 
  const [dbIncomingOrders, setDbIncomingOrders] = useState<any[]>([]); 
  const [dbTables, setDbTables] = useState<any[]>([]); 
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Helper cerdas untuk mendeteksi nama kolom kode meja secara dinamis
  const getTableCode = (t: any) => {
    if (!t) return "";
    return t.table_no || t.table_code || t.name || t.nomor_meja || t.table_number || t.no_meja || String(t.id);
  };

  // 1. Ambil Semua Transaksi Sukses (Aman dari eror kolom table_code)
  const fetchTransactions = async () => {
    try {
      const { data: txData, error: txErr } = await supabase
        .from("transactions")
        .select(`id, customer_id, total, payment_method, status, created_at, table_id`)
        .order("created_at", { ascending: false });

      const { data: profData } = await supabase
        .from("customer_profiles")
        .select("user_id, nama_depan, nama_belakang");

      const { data: tableData } = await supabase
        .from("cafe_tables")
        .select("*"); // 💡 AMAN: Mengambil semua kolom agar tidak eror jika table_code tidak ada

      if (!txErr && txData && profData) {
        const profileMap = new Map(profData.map(p => [p.user_id, p]));
        const tableMap = new Map(tableData ? tableData.map(t => [String(t.id), getTableCode(t)]) : []);

        const mapped = txData.map((t: any) => {
          const prof = profileMap.get(t.customer_id);
          const tableCode = tableMap.get(String(t.table_id)) || String(t.table_id);
          return {
            ...t,
            table_id: tableCode,
            customers: prof ? {
              name: `${prof.nama_depan || ""} ${prof.nama_belakang || ""}`.trim() || "Guest"
            } : null
          };
        });
        setDbTransactions(mapped);
      }
    } catch (err) {
      console.error("Error internal fetchTransactions:", err);
    }
  };

  // 2. Ambil Pesanan Masuk (Aman dari eror kolom table_code)
  const fetchIncomingOrders = async () => {
    try {
      const { data: txData, error: txErr } = await supabase
        .from("transactions")
        .select(`
          id, 
          customer_id,
          total, 
          payment_method, 
          status, 
          created_at, 
          table_id,
          transaction_details (
            id, 
            qty, 
            price, 
            menus (name)
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      const { data: profData } = await supabase
        .from("customer_profiles")
        .select("user_id, nama_depan, nama_belakang");

      const { data: tableData } = await supabase
        .from("cafe_tables")
        .select("*");

      const { data: gsData } = await supabase
        .from("game_sessions")
        .select(`
          id, customer_id, table_id, start_time, duration, cost, status,
          boardgames (name)
        `)
        .order("start_time", { ascending: false })
        .limit(100);

      if (!txErr && txData && profData) {
        const profileMap = new Map(profData.map(p => [p.user_id, p]));
        const tableMap = new Map(tableData ? tableData.map(t => [String(t.id), getTableCode(t)]) : []);

        const hiddenStr = localStorage.getItem("kasir_hidden_orders") || "[]";
        let hiddenIds: number[] = [];
        try { hiddenIds = JSON.parse(hiddenStr); } catch (e) {}

        const mapped = txData
          .filter(item => !hiddenIds.includes(item.id))
          .map((item: any) => {
            const prof = profileMap.get(item.customer_id);
            const tableCode = tableMap.get(String(item.table_id)) || String(item.table_id);
            
            // Match rentals from game_sessions created within 5 seconds of this transaction
            const txTime = new Date(item.created_at).getTime();
            const matchedRentals = gsData?.filter((gs: any) => 
              gs.customer_id === item.customer_id && 
              gs.table_id === item.table_id &&
              Math.abs(new Date(gs.start_time).getTime() - txTime) < 300000
            ) || [];

            return {
              ...item,
              table_id: tableCode,
              customers: prof ? {
                name: `${prof.nama_depan || ""} ${prof.nama_belakang || ""}`.trim() || "Guest Pelanggan",
                phone: "-"
              } : null,
              rentals: matchedRentals.map((r: any) => ({
                id: r.id,
                name: r.boardgames?.name || "Board Game",
                duration: r.duration ? `${r.duration} Jam` : "2 Jam",
                price: r.cost
              }))
            };
          });
        setDbIncomingOrders(mapped);
      }
    } catch (err) {
      console.error("Error internal fetchIncomingOrders:", err);
    }
  };

  // 3. Ambil Daftar Master Meja Aktif dari Tabel cafe_tables
  const fetchTables = async () => {
    try {
      const { data, error } = await supabase
        .from("cafe_tables")
        .select("*");
        
      if (!error && data) {
        const mapped = data.map((t: any) => ({
          id: t.id,
          code: getTableCode(t),
          status: t.status || "Available"
        }));
        setDbTables(mapped);
      } else if (error) {
        console.error("Error fetchTables:", error.message);
      }
    } catch (err) {
      console.error("Error internal fetchTables:", err);
    }
  };

  const fetchMenus = async () => {
    const { data, error } = await supabase.from("menus").select("*").order("name", { ascending: true });
    if (!error && data) setDbMenus(data);
  };

  const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("customer_profiles")
        .select("user_id, nama_depan, nama_belakang, phone")
        .order("nama_depan", { ascending: true });
      
      if (!error && data) {
        const mapped = data.map((c: any) => ({
          id: c.user_id, 
          name: `${c.nama_depan || ""} ${c.nama_belakang || ""}`.trim(),
          phone: c.phone || "-"
        }));
      setDbCustomers(mapped);
    }
  };

  const fetchBoardgames = async () => {
    const { data, error } = await supabase.from("boardgames").select("*").order("name", { ascending: true });
    if (!error && data) setDbBoardgames(data);
  };

  // 4. Ambil Sesi Rental Meja Aktif (Bypass Join manual)
  const fetchSessions = async () => {
    try {
      const { data: sessionData, error: sErr } = await supabase
        .from("game_sessions")
        .select(`
          id, customer_id, start_time, end_time, duration, status, table_id,
          boardgames!boardgame_id (name, title, image)
        `)
        .eq("status", "Active");

      const { data: profData } = await supabase
        .from("customer_profiles")
        .select("user_id, nama_depan, nama_belakang, phone");

      const { data: tableData } = await supabase
        .from("cafe_tables")
        .select("*");

      if (!sErr && sessionData && profData) {
        const profileMap = new Map(profData.map(p => [p.user_id, p]));
        const tableMap = new Map(tableData ? tableData.map(t => [String(t.id), getTableCode(t)]) : []);

        const transformed = sessionData.map((s: any) => {
          const endTimeStr = s.end_time.includes("Z") || s.end_time.includes("+") ? s.end_time : `${s.end_time}Z`;
          const endTime = new Date(endTimeStr).getTime();
          const now = new Date().getTime();
          const diffSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
          
          const prof = profileMap.get(s.customer_id);
          const tableCode = tableMap.get(String(s.table_id)) || String(s.table_id);

          return {
            id: s.id,
            name: prof ? `${prof.nama_depan || ""} ${prof.nama_belakang || ""}`.trim() : "Walk-in Guest",
            phone: prof?.phone || "-",
            table: tableCode || "A1", 
            game: s.boardgames?.name || s.boardgames?.title || "Board Game", 
            image: s.boardgames?.image || "",
            duration: `${s.duration} Mins`,
            secondsLeft: diffSeconds
          };
        });
        setDbSessions(transformed);
      }
    } catch (err) {
      console.error("Error internal fetchSessions:", err);
    }
  };

  const approveIncomingOrder = async (transactionId: number, customerId: string, tableId: string) => {
    try {
      const { error: txErr } = await supabase
        .from("transactions")
        .update({ status: "Success" })
        .eq("id", transactionId);

      if (txErr) throw txErr;

      // Pencarian ID Meja berbasis Client-Side (Bebas dari eror nama kolom database)
      const { data: tableData } = await supabase.from("cafe_tables").select("*");
      const foundTable = tableData?.find(t => String(getTableCode(t)).toLowerCase() === String(tableId).toLowerCase());
      const cleanTableId = foundTable ? foundTable.id : (isNaN(Number(tableId)) ? tableId : Number(tableId));

      await supabase
        .from("game_sessions")
        .update({ status: "Active" })
        .eq("customer_id", customerId)
        .eq("table_id", cleanTableId)
        .eq("status", "Pending");

      await fetchIncomingOrders();
      await fetchTransactions();
      await fetchSessions();
    } catch (err) {
      console.error("Gagal menerima pesanan pelanggan:", err);
    }
  };

  const rejectIncomingOrder = async (transactionId: number, customerId: string, tableId: string) => {
    try {
      const { error: txErr } = await supabase
        .from("transactions")
        .update({ status: "Cancelled" })
        .eq("id", transactionId);

      if (txErr) throw txErr;

      const { data: tableData } = await supabase.from("cafe_tables").select("*");
      const foundTable = tableData?.find(t => String(getTableCode(t)).toLowerCase() === String(tableId).toLowerCase());
      const cleanTableId = foundTable ? foundTable.id : (isNaN(Number(tableId)) ? tableId : Number(tableId));

      const { data: pendingSessions } = await supabase
        .from("game_sessions")
        .select("id, boardgame_id")
        .eq("customer_id", customerId)
        .eq("table_id", cleanTableId)
        .eq("status", "Pending");

      if (pendingSessions && pendingSessions.length > 0) {
        for (const ps of pendingSessions) {
           await supabase.from("game_sessions").delete().eq("id", ps.id);
           if (ps.boardgame_id) {
             await supabase.from("boardgames").update({ status: "Available" }).eq("id", ps.boardgame_id);
           }
        }
      }

      await fetchIncomingOrders();
      await fetchTransactions();
    } catch (err) {
      console.error("Gagal menolak pesanan pelanggan:", err);
    }
  };

  const deleteIncomingOrder = async (transactionId: number) => {
    try {
      // Hide locally in Kasir Dashboard only (don't delete from Supabase so Customer history is preserved)
      const hiddenStr = localStorage.getItem("kasir_hidden_orders") || "[]";
      let hiddenIds: number[] = [];
      try { hiddenIds = JSON.parse(hiddenStr); } catch (e) {}
      
      hiddenIds.push(transactionId);
      localStorage.setItem("kasir_hidden_orders", JSON.stringify(hiddenIds));
      
      // Update state locally so UI reacts immediately
      setDbIncomingOrders(prev => prev.filter(o => o.id !== transactionId));
    } catch (err) {
      console.error("Gagal menyembunyikan pesanan:", err);
    }
  };

  // 4. Fetch Categories
  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (data) setDbCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchBoardgames();
    fetchMenus();
    fetchSessions();
    fetchTransactions();
    fetchIncomingOrders();
    fetchTables();
    fetchCategories();

    const sessionChannel = supabase
      .channel("supabase-realtime-sessions")
      .on("postgres_changes", { event: "*", schema: "public", table: "game_sessions" }, () => {
        fetchSessions();
        fetchBoardgames();
        fetchIncomingOrders();
      }).subscribe();

    const transactionChannel = supabase
      .channel("supabase-realtime-transactions")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => {
        fetchTransactions();
        fetchIncomingOrders();
      }).subscribe();

    const tableChannel = supabase
      .channel("supabase-realtime-tables")
      .on("postgres_changes", { event: "*", schema: "public", table: "cafe_tables" }, () => {
        fetchTables();
      }).subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
      supabase.removeChannel(transactionChannel);
      supabase.removeChannel(tableChannel);
    };
  }, []);

  const createNewCustomer = async (name: string, phone: string) => {
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const generatedUserId = "CUST-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const { data, error } = await supabase
      .from("customer_profiles")
      .insert([{ 
        user_id: generatedUserId,
        nama_depan: firstName, 
        nama_belakang: lastName, 
        tanggal_lahir: "2005-04-24", 
        status: "Active - Regular" 
      }])
      .select().single();

    if (error) throw error;
    await fetchCustomers(); 
    return {
      id: data.user_id,
      name: `${data.nama_depan} ${data.nama_belakang}`.trim()
    };
  };

  // 💡 PERBAIKAN: Pencarian ID Meja berbasis JavaScript Client agar 100% aman dari eror 400
  const startRentalSession = async (customerId: string, tableId: string, boardgameId: number, durationMinutes: number, costAmount: number, players: number = 2) => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
    
    // Tarik master meja cloud secara live untuk pencocokan yang akurat
    const { data: tableData } = await supabase.from("cafe_tables").select("*");
    const foundTable = tableData?.find(
      t => String(getTableCode(t)).toLowerCase() === String(tableId).toLowerCase() || String(t.id) === String(tableId)
    );
    const cleanTableId = foundTable ? foundTable.id : (isNaN(Number(tableId)) ? tableId : Number(tableId));

    const { data, error } = await supabase
      .from("game_sessions")
      .insert([{
        customer_id: customerId, 
        table_id: cleanTableId, 
        boardgame_id: boardgameId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationMinutes,
        cost: costAmount,
        status: "Active"
      }])
      .select()
      .single(); 

    if (error) {
      console.error("Detail Eror Insert Game Session:", error.message);
      throw error;
    }

    await supabase.from("boardgames").update({ status: "In Use" }).eq("id", boardgameId);
    await fetchSessions(); 
    await fetchBoardgames();
    return data;
  };

  const endRentalSession = async (sessionId: number) => {
    const { data: sessionData } = await supabase.from("game_sessions").select("boardgame_id").eq("id", sessionId).single();
    const { error } = await supabase.from("game_sessions").update({ status: "Completed", end_time: new Date().toISOString() }).eq("id", sessionId);

    if (error) throw error;
    if (sessionData?.boardgame_id) {
      await supabase.from("boardgames").update({ status: "Available" }).eq("id", sessionData.boardgame_id);
    }
    await fetchSessions(); 
    await fetchBoardgames();
  };

  const extendRentalSession = async (sessionId: number, currentSecondsLeft: number, additionalMinutes: number) => {
    const newEndTime = new Date(new Date().getTime() + (currentSecondsLeft + (additionalMinutes * 60)) * 1000);
    const { error } = await supabase.from("game_sessions").update({ end_time: newEndTime.toISOString() }).eq("id", sessionId);
    if (error) throw error;
    await fetchSessions();
  };

  const checkoutPOSToSupabase = async (customerId: string, totalAmount: number, paymentMethod: string, tableId: string, cartItems: any[], players: number = 2) => {
    const { data: tableData } = await supabase.from("cafe_tables").select("*");
    const foundTable = tableData?.find(t => String(getTableCode(t)).toLowerCase() === String(tableId).toLowerCase());
    const cleanTableId = foundTable ? foundTable.id : (isNaN(Number(tableId)) ? tableId : Number(tableId));

    // 1. Insert Transaction
    const { data: txn, error: txnErr } = await supabase
      .from("transactions")
      .insert([{ 
        customer_id: customerId, 
        total: totalAmount, 
        payment_method: paymentMethod, 
        status: "Success", 
        table_id: cleanTableId
      }])
      .select().single();
    if (txnErr) throw txnErr;

    // 2. Separate items
    const fnbItems = cartItems.filter(item => !String(item.id).startsWith("g"));
    const gameItems = cartItems.filter(item => String(item.id).startsWith("g"));

    // 3. Insert FnB to transaction_details
    if (fnbItems.length > 0) {
      const detailsData = fnbItems.map(item => {
        const itemIdStr = String(item.id); 
        const cleanMenuId = itemIdStr.startsWith("p") ? parseInt(itemIdStr.replace("p", "")) : parseInt(itemIdStr);
        return { transaction_id: txn.id, menu_id: cleanMenuId, qty: item.quantity, price: item.price };
      });
      await supabase.from("transaction_details").insert(detailsData);
    }

    // 4. Insert Game Sessions
    let gsInsertedData: any[] = [];
    if (gameItems.length > 0) {
      const gameSessionInserts = gameItems.map(item => {
        const itemIdStr = String(item.id);
        const cleanGameId = itemIdStr.startsWith("g") ? parseInt(itemIdStr.replace("g", "")) : parseInt(itemIdStr);
        
        const durationStr = String(item.duration || "2 Hours").toLowerCase();
        let durationMins = 120;
        if (durationStr.includes("1 hour") || durationStr.includes("1 jam")) durationMins = 60;
        if (durationStr.includes("3 hour") || durationStr.includes("3 jam")) durationMins = 180;
        if (durationStr.includes("all day") || durationStr.includes("seharian")) durationMins = 600;

        return {
          customer_id: customerId,
          table_id: cleanTableId,
          boardgame_id: cleanGameId,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + durationMins * 60000).toISOString(),
          duration: durationMins,
          cost: item.price || 0,
          status: 'Active' // Kasir immediately activates it
        };
      });

      const { data: gameData, error: gameError } = await supabase
        .from('game_sessions')
        .insert(gameSessionInserts)
        .select('id, boardgame_id');
        
      if (gameError) throw gameError;
      if (gameData) {
        gsInsertedData = gameData;
        const boardgameIds = gameData.map(g => g.boardgame_id);
        if (boardgameIds.length > 0) {
          await supabase.from('boardgames').update({ status: 'In Use' }).in('id', boardgameIds);
        }
      }
    }

    // Attempt to sync player count via local storage on Kasir side (in case they use the same device)
    try {
      const savedPlayers = localStorage.getItem("sebangku_order_players");
      const playersMap = savedPlayers ? JSON.parse(savedPlayers) : {};
      if (txn?.id) playersMap[String(txn.id)] = players;
      if (gsInsertedData.length > 0) {
        gsInsertedData.forEach((gs: any) => {
          playersMap[`gs-${gs.id}`] = players;
        });
      }
      localStorage.setItem("sebangku_order_players", JSON.stringify(playersMap));
    } catch (e) {}

    await fetchTransactions();
    await fetchSessions();
    await fetchBoardgames();

    return txn;
  };

  const checkoutViaWinpayToSupabase = async (customerId: string, totalAmount: number, channelCode: string, tableId: string, cartItems: any[]) => {
    const orderRefId = `SBK-WP-${Date.now().toString().slice(-6)}`;
    const { data: tableData } = await supabase.from("cafe_tables").select("*");
    const foundTable = tableData?.find(t => String(getTableCode(t)).toLowerCase() === String(tableId).toLowerCase());
    const cleanTableId = foundTable ? foundTable.id : (isNaN(Number(tableId)) ? tableId : Number(tableId));

    const { data: txn, error: txnErr } = await supabase
      .from("transactions")
      .insert([{ customer_id: customerId, total: totalAmount, payment_method: `Winpay (${channelCode})`, status: "Pending", table_id: cleanTableId }])
      .select().single();
    if (txnErr) throw txnErr;

    const detailsData = cartItems.map(item => {
      const itemIdStr = String(item.id); 
      const cleanMenuId = itemIdStr.startsWith("p") ? parseInt(itemIdStr.replace("p", "")) : parseInt(itemIdStr);
      return { transaction_id: txn.id, menu_id: cleanMenuId, qty: item.quantity, price: item.price };
    });

    await supabase.from("transaction_details").insert(detailsData);
    return { txn, orderRefId };
  };

  return {
    dbCustomers, dbSessions, dbBoardgames, dbMenus, dbTransactions, dbIncomingOrders, dbTables, dbCategories, 
    createNewCustomer, startRentalSession, endRentalSession, extendRentalSession, 
    checkoutPOSToSupabase, checkoutViaWinpayToSupabase, approveIncomingOrder, rejectIncomingOrder, deleteIncomingOrder
  };
}