import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Plus, Minus, CreditCard, Banknote, CheckCircle,
  LogOut, PlusCircle, X, ShoppingBag, LayoutDashboard,
  Users, Settings, Printer, Check, Clock, Dices, User, Tag,
  Bell, BellRing
} from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

// Import Board Game Images
import mystKidsImg from "../../assets/images/Mysterium Kids.png";
import luckyCapImg from "../../assets/images/Lucky Captain.png";
import krakenAttImg from "../../assets/images/Kraken Attack.png";
import sleepyCasImg from "../../assets/images/Sleepy Castle.png";
import detCharImg from "../../assets/images/Detective Charlie.png";
import rubenRalImg from "../../assets/images/Ruben Rallye.png";
import waroongWarsImg from "../../assets/images/Waroong Wars.png";
import foldItImg from "../../assets/images/Fold it.png";
import slideQuestImg from "../../assets/images/Slide Quest.png";
import goldOrinImg from "../../assets/images/Gold Am Orinoko.png";
import fourRowImg from "../../assets/images/4 in a Row On The Go.png";
import magicMazeImg from "../../assets/images/Magic Maze.png";

// ─── Initial Mock Data ───────────────────────────────────────────────────────
const INITIAL_CUSTOMERS = [
  { id: 1, name: "Andi Saputra", phone: "081234567890", active: true },
  { id: 2, name: "Budi Laksono", phone: "082345678901", active: false },
  { id: 3, name: "Citra Dewi", phone: "083456789012", active: true },
  { id: 4, name: "Dika Pratama", phone: "084567890123", active: false },
  { id: 5, name: "Eva Susanti", phone: "085678901234", active: true },
  { id: 6, name: "Fajar Nugroho", phone: "086789012345", active: false }
];

const PRODUCTS = [
  { id: "p1", name: "Mie Goreng Special", price: 25000, category: "Food", emoji: "🍜", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&fit=crop&q=80" },
  { id: "p2", name: "Nasi Goreng", price: 22000, category: "Food", emoji: "🍛", image: "https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?w=200&fit=crop&q=80" },
  { id: "p3", name: "Kentang Goreng", price: 18000, category: "Snacks", emoji: "🍟", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&fit=crop&q=80" },
  { id: "p4", name: "Kopi Hitam", price: 12000, category: "Drinks", emoji: "☕", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&fit=crop&q=80" },
  { id: "p5", name: "Es Teh Manis", price: 8000, category: "Drinks", emoji: "🍹", image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=200&fit=crop&q=80" },
  { id: "p6", name: "Es Kopi Susu", price: 20000, category: "Drinks", emoji: "🥛", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&fit=crop&q=80" },
  { id: "p7", name: "Snack Mix", price: 15000, category: "Snacks", emoji: "🍿", image: "https://images.unsplash.com/photo-1599490659213-e2b9527b0876?w=200&fit=crop&q=80" },
  { id: "p8", name: "Pisang Goreng", price: 14000, category: "Snacks", emoji: "🍌", image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=200&fit=crop&q=80" },
  { id: "p9", name: "Sandwich Tuna", price: 28000, category: "Food", emoji: "🥪", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&fit=crop&q=80" },
];

const RENT_GAMES = [
  { id: "g1", name: "Mysterium Kids", price: 15000, category: "Cooperative", emoji: "🎲", image: mystKidsImg },
  { id: "g2", name: "Lucky Captain", price: 12000, category: "Strategy", emoji: "🚂", image: luckyCapImg },
  { id: "g3", name: "Kraken Attack", price: 12000, category: "Strategy", emoji: "🦠", image: krakenAttImg },
  { id: "g4", name: "Sleepy Castle", price: 10000, category: "Strategy", emoji: "🏠", image: sleepyCasImg },
  { id: "g5", name: "Detective Charlie", price: 8000, category: "Strategy", emoji: "👑", image: detCharImg },
  { id: "g6", name: "Ruben Rallye", price: 8000, category: "Family", emoji: "🕵️", image: rubenRalImg },
  { id: "g7", name: "Waroong Wars", price: 15000, category: "Strategy", emoji: "🐦", image: waroongWarsImg },
  { id: "g8", name: "Fold it", price: 10000, category: "Party", emoji: "🌲", image: foldItImg },
  { id: "g9", name: "Slide Quest", price: 10000, category: "Party", emoji: "🛡️", image: slideQuestImg },
  { id: "g10", name: "Gold Am Orinoko", price: 12000, category: "Strategy", emoji: "🥇", image: goldOrinImg },
  { id: "g11", name: "4 in a Row On The Go", price: 5000, category: "Family", emoji: "🔘", image: fourRowImg },
  { id: "g12", name: "Magic Maze", price: 12000, category: "Strategy", emoji: "🧙", image: magicMazeImg }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  image?: string;
  quantity: number;
}

export default function KasirPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "T01";

  // Products & Rentals state loaded from localStorage with fallbacks
  const [products, setProducts] = useState<any[]>(() => {
    const saved = localStorage.getItem("sebangku_products");
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [rentGames, setRentGames] = useState<any[]>(() => {
    const saved = localStorage.getItem("sebangku_rent_games");
    return saved ? JSON.parse(saved) : RENT_GAMES;
  });

  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  // Sync state with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem("sebangku_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      const savedRentGames = localStorage.getItem("sebangku_rent_games");
      if (savedRentGames) setRentGames(JSON.parse(savedRentGames));
      const savedBoardGames = localStorage.getItem("sebangku_board_games");
      if (savedBoardGames) setBoardGames(JSON.parse(savedBoardGames));
      
      const savedOrders = localStorage.getItem("sebangku_customer_orders");
      if (savedOrders) setCustomerOrders(JSON.parse(savedOrders));
    };
    window.addEventListener("storage", handleStorageChange);
    // Also sync on mount
    handleStorageChange();

    // 2-second polling interval
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Sidebar active state (mock)
  const [activeMenu, setActiveMenu] = useState("pos");

  // Customers
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof INITIAL_CUSTOMERS[0] | null>(INITIAL_CUSTOMERS[0]);

  // POS Navigation / Tabs
  const [activeTab, setActiveTab] = useState<"f&b" | "rent">("f&b");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Search product/game
  const [searchQuery, setSearchQuery] = useState("");

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "QRIS">("Cash");

  // Modals
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");

  // Receipt printed info
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  // QRIS Payment Simulation States
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [qrisStatus, setQrisStatus] = useState<"pending" | "success">("pending");
  const [pendingReceipt, setPendingReceipt] = useState<any>(null);

  // Active Sessions States
  const [sessions, setSessions] = useState<any[]>(() => {
    const saved = localStorage.getItem("sebangku_sessions");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Andi Saputra", phone: "081234567890", table: "A1", game: "Mysterium Kids", duration: "2 Hours", secondsLeft: 2536 },
      { id: 2, name: "Citra Dewi", phone: "083456789012", table: "C2", game: "Lucky Captain", duration: "All Day", secondsLeft: 21436 },
      { id: 3, name: "Dika Pratama", phone: "084567890123", table: "A2", game: "Kraken Attack", duration: "3 Hours", secondsLeft: 7936 },
      { id: 4, name: "Eva Susanti", phone: "085678901234", table: "D1", game: "Fold it", duration: "2 Hours", secondsLeft: 3676 },
      { id: 5, name: "Sebangku", phone: "0814124412", table: "B3", game: "Slide Quest", duration: "1 Hour", secondsLeft: 3576 }
    ];
  });

  useEffect(() => {
    localStorage.setItem("sebangku_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const unreadOrdersCount = useMemo(() => {
    return customerOrders.filter(o => o.status === "paid").length;
  }, [customerOrders]);

  const [completedSessionsCount, setCompletedSessionsCount] = useState(13);
  const [rentalRevenue, setRentalRevenue] = useState(910000);
  const [sessionFilter, setSessionFilter] = useState<"All" | "Ending Soon" | "All Day">("All");

  // New Session Modal States
  const [showAddSession, setShowAddSession] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionPhone, setNewSessionPhone] = useState("");
  const [newSessionTable, setNewSessionTable] = useState("A1");
  const [newSessionGame, setNewSessionGame] = useState("Mysterium Kids");
  const [newSessionDuration, setNewSessionDuration] = useState("2 Hours");

  // Action Confirmation Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"end" | "extend" | null>(null);
  const [confirmTargetId, setConfirmTargetId] = useState<number | null>(null);
  const [confirmTargetName, setConfirmTargetName] = useState<string | null>(null);
  const [extendOption, setExtendOption] = useState<"30 min" | "1 Hour" | "2 Hours">("1 Hour");

  // Board Game Collection States
  const [boardGames, setBoardGames] = useState([
    { id: "bg1", name: "Mysterium Kids", rating: 4.8, players: "2-6", duration: "21 min", category: "Cooperative", status: "Available", image: mystKidsImg, minAge: "6+", complexity: "Easy", description: "Mysterium Kids adalah permainan kooperatif di mana pemain harus menebak objek berdasarkan suara dari tamborin kecil." },
    { id: "bg2", name: "Lucky Captain", rating: 4.5, players: "2-4", duration: "30 min", category: "Strategy", status: "In Use", currentUser: "Budi L.", endTime: "17:30", image: luckyCapImg, minAge: "8+", complexity: "Medium", description: "Lucky Captain adalah permainan strategi bajak laut taktis yang memadukan pengumpulan harta karun dan pertempuran seru di laut lepas." },
    { id: "bg3", name: "Kraken Attack", rating: 4.7, players: "1-4", duration: "25 min", category: "Strategy", status: "Available", image: krakenAttImg, minAge: "5+", complexity: "Easy", description: "Kraken Attack adalah permainan kooperatif seru di mana seluruh kru kapal harus bekerja sama mempertahankan dek dari serbuan tentakel gurita raksasa." },
    { id: "bg4", name: "Sleepy Castle", rating: 4.9, players: "1-4", duration: "10 min", category: "Strategy", status: "Available", image: sleepyCasImg, minAge: "6+", complexity: "Easy", description: "Sleepy Castle adalah permainan ingatan dan strategi ringan di mana ksatria menyelinap ke istana yang tertidur untuk menyelamatkan putri." },
    { id: "bg5", name: "Detective Charlie", rating: 4.6, players: "1-5", duration: "25 min", category: "Strategy", status: "Maintenance", image: detCharImg, minAge: "7+", complexity: "Easy", description: "Detective Charlie adalah permainan deduksi anak-anak kooperatif untuk memecahkan misteri di Pulau Mainan bersama detektif terbaik." },
    { id: "bg6", name: "Ruben Rallye", rating: 4.6, players: "2-4", duration: "15 min", category: "Family", status: "Available", image: rubenRalImg, minAge: "6+", complexity: "Easy", description: "Ruben Rallye adalah permainan balap mobil taktis yang menyenangkan, melatih ketangkasan berhitung dan keputusan cepat." },
    { id: "bg7", name: "Waroong Wars", rating: 4.4, players: "3-5", duration: "30 min", category: "Strategy", status: "Available", image: waroongWarsImg, minAge: "8+", complexity: "Medium", description: "Waroong Wars adalah permainan kartu bertema kuliner khas Indonesia. Jadilah warung terbaik dengan mengelola bahan masakan." },
    { id: "bg8", name: "Fold it", rating: 4.2, players: "1-5", duration: "20 min", category: "Party", status: "In Use", currentUser: "Reni W.", endTime: "18:00", image: foldItImg, minAge: "7+", complexity: "Medium", description: "Fold It melatih kecepatan berpikir dan motorik tangan. Pemain harus melipat saputangan kain sesuai dengan resep pesanan secepat mungkin." },
    { id: "bg9", name: "Slide Quest", rating: 4.5, players: "1-4", duration: "45 min", category: "Party", status: "Available", image: slideQuestImg, minAge: "6+", complexity: "Easy", description: "Slide Quest adalah permainan kooperatif seru di mana para pemain harus memiringkan papan untuk memandu ksatria meluncur melewati rintangan." },
    { id: "bg10", name: "Gold Am Orinoko", rating: 4.4, players: "2-4", duration: "20 min", category: "Strategy", status: "Available", image: goldOrinImg, minAge: "7+", complexity: "Medium", description: "Petualangan melintasi sungai Orinoko yang berbahaya. Gunakan strategi melompat di batang kayu untuk membawa emas kuno kembali ke desa." },
    { id: "bg11", name: "4 in a Row On The Go", rating: 4.3, players: "2-2", duration: "10 min", category: "Family", status: "Available", image: fourRowImg, minAge: "6+", complexity: "Easy", description: "Permainan menyusun 4 koin berurutan secara horizontal, vertikal, atau diagonal yang legendaris, praktis dibawa ke mana saja." },
    { id: "bg12", name: "Magic Maze", rating: 4.3, players: "1-7", duration: "15 min", category: "Strategy", status: "Maintenance", image: magicMazeImg, minAge: "8+", complexity: "Medium", description: "Magic Maze adalah permainan kooperatif real-time yang unik. Para pemain tidak boleh berbicara saat mengontrol pergerakan pahlawan." }
  ]);
  const [searchGameQuery, setSearchGameQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"All" | "Available" | "In Use" | "Maintenance">("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<"All" | "Strategy" | "Family" | "Party" | "Card" | "Cooperative">("All");
  const [gameLayoutView, setGameLayoutView] = useState<"grid" | "list">("grid");
  const [selectedDetailGame, setSelectedDetailGame] = useState<any>(null);

  // Timer Ticking Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessions(prev =>
        prev.map(s => {
          if (s.secondsLeft > 0) {
            return { ...s, secondsLeft: s.secondsLeft - 1 };
          }
          return s;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time formatter
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      String(hrs).padStart(2, '0'),
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].join(':');
  };

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (sessionFilter === "Ending Soon") {
        return s.secondsLeft < 3600;
      }
      if (sessionFilter === "All Day") {
        return s.duration === "All Day";
      }
      return true;
    });
  }, [sessions, sessionFilter]);

  // Session Handlers
  const handleEndSession = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setCompletedSessionsCount(prev => prev + 1);
    setRentalRevenue(prev => prev + 15000);
  };

  const handleExtendSession = (id: number, option: "30 min" | "1 Hour" | "2 Hours") => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        let addedSeconds = 0;
        let newDuration = s.duration;

        if (option === "30 min") {
          addedSeconds = 1800;
          if (s.duration !== "All Day") {
            newDuration = "Extended";
          }
        } else if (option === "1 Hour") {
          addedSeconds = 3600;
          if (s.duration !== "All Day") {
            const currentHours = parseInt(s.duration);
            newDuration = isNaN(currentHours) ? "1 Hour" : `${currentHours + 1} Hours`;
          }
        } else if (option === "2 Hours") {
          addedSeconds = 7200;
          if (s.duration !== "All Day") {
            const currentHours = parseInt(s.duration);
            newDuration = isNaN(currentHours) ? "2 Hours" : `${currentHours + 2} Hours`;
          }
        }
        return {
          ...s,
          secondsLeft: s.secondsLeft + addedSeconds,
          duration: newDuration
        };
      }
      return s;
    }));
    let addedRevenue = 10000;
    if (option === "30 min") addedRevenue = 5000;
    else if (option === "2 Hours") addedRevenue = 20000;
    setRentalRevenue(prev => prev + addedRevenue);
  };

  // Initial lookup helpers
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const formatRupiah = (val: number) => {
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      c.phone.includes(searchCustomer)
    );
  }, [customers, searchCustomer]);

  // Filtered Board Games for Collection Page
  const filteredBoardGames = useMemo(() => {
    return boardGames.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchGameQuery.toLowerCase());
      const matchesStatus = selectedStatusFilter === "All" || game.status === selectedStatusFilter;
      const matchesCategory = selectedCategoryFilter === "All" || game.category === selectedCategoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [boardGames, searchGameQuery, selectedStatusFilter, selectedCategoryFilter]);

  // Filtered Products/Games
  const itemsToDisplay = useMemo(() => {
    const list = activeTab === "f&b" ? products : rentGames;
    // Filter out inactive or out of stock items if necessary, but we can also display them with a badge
    return list.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeTab, selectedCategory, searchQuery, products, rentGames]);

  // Categories list
  const categories = useMemo(() => {
    if (activeTab === "f&b") {
      return ["All", "Food", "Drinks", "Snacks"];
    }
    return ["All", "Strategy", "Family", "Co-op", "Classic", "Party"];
  }, [activeTab]);

  // Cart Handlers
  const addToCart = (item: any) => {
    // Check if item is out of stock / not active
    if (item.status === "Out of Stock" || item.status === "Maintenance" || item.active === false) {
      alert(`${item.name} sedang tidak tersedia!`);
      return;
    }
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, emoji: item.emoji || "🎲", image: item.image, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean) as CartItem[];
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  // Register Customer
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;
    const newCust = {
      id: Date.now(),
      name: newCustName,
      phone: newCustPhone,
      active: true
    };
    setCustomers(prev => [...prev, newCust]);
    setSelectedCustomer(newCust);
    setNewCustName("");
    setNewCustPhone("");
    setShowAddCustomer(false);
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Separate F&B items (id starts with p) and game rentals (id starts with g)
    const fbItems = cart.filter(item => item.id.startsWith("p"));
    const rentItems = cart.filter(item => item.id.startsWith("g"));

    const subtotalFB = fbItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const rentalCost = rentItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Determine the rented game for the recap if any
    const rentedGame = rentItems.length > 0 ? rentItems[0] : null;
    const durationHours = rentedGame ? rentedGame.quantity : 0;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    const formattedTime = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const endHour = new Date(now.getTime() + (durationHours || 2) * 60 * 60 * 1000);
    const formattedEndTime = endHour.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    // Barcode date prefix format e.g. TXN-20260616-0012
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomSuffix = String(Math.floor(1000 + Math.random() * 9000));
    const txnId = `TXN-${yyyy}${mm}${dd}-${randomSuffix}`;

    const receiptInfo = {
      id: txnId,
      dateDisplay: `${formattedDate} · ${formattedTime}`,
      customer: selectedCustomer ? selectedCustomer.name : "Walk-in Guest",
      items: [...cart],
      fbItems,
      rentItems,
      subtotalFB,
      rentalCost,
      rentedGame,
      durationHours: durationHours || 2,
      endTimeDisplay: formattedEndTime,
      total: cartTotal,
      paymentMethod
    };

    if (paymentMethod === "QRIS") {
      setPendingReceipt(receiptInfo);
      setQrisStatus("pending");
      setShowQRISModal(true);
      setCart([]); // Clear cart ready for next
    } else {
      setLastReceipt(receiptInfo);
      setShowCheckoutSuccess(true);
      setCart([]);
    }
  };

  const handleAcceptOrder = (order: any) => {
    // 1. Create sessions for rented games
    if (order.rentals && order.rentals.length > 0) {
      const newSessionsList = [...sessions];
      order.rentals.forEach((rental: any) => {
        let initialSeconds = 7200; // default 2 hours
        if (rental.duration === "1 Hour") initialSeconds = 3600;
        else if (rental.duration === "3 Hours") initialSeconds = 10800;
        else if (rental.duration === "All Day") initialSeconds = 28800; // 8 hours

        const newSession = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: order.customerName,
          phone: order.customerPhone,
          table: order.table || "A1",
          game: rental.name,
          duration: rental.duration || "2 Hours",
          secondsLeft: initialSeconds
        };
        newSessionsList.unshift(newSession);
      });
      setSessions(newSessionsList);
    }

    // 2. Update order status to in_progress
    const savedOrders = localStorage.getItem("sebangku_customer_orders");
    if (savedOrders) {
      const list = JSON.parse(savedOrders);
      const updated = list.map((o: any) => {
        if (o.id === order.id) {
          return { ...o, status: "in_progress" };
        }
        return o;
      });
      localStorage.setItem("sebangku_customer_orders", JSON.stringify(updated));
      setCustomerOrders(updated);
      window.dispatchEvent(new Event("storage"));
    }
    alert(`Pesanan ${order.id} berhasil diterima!`);
  };

  const handleCancelOrder = (order: any) => {
    if (!window.confirm(`Yakin ingin membatalkan pesanan ${order.id}?`)) return;
    const savedOrders = localStorage.getItem("sebangku_customer_orders");
    if (savedOrders) {
      const list = JSON.parse(savedOrders);
      const updated = list.filter((o: any) => o.id !== order.id);
      localStorage.setItem("sebangku_customer_orders", JSON.stringify(updated));
      setCustomerOrders(updated);
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── 1. SIDEBAR (Navy Style) ────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-[220px] shrink-0 flex-col justify-between"
        style={{
          background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 40
        }}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
            <img src={sebangkuLogo} alt="Sebangku Logo" className="w-8 h-8 object-contain" />
            <div>
              <p className="text-white font-black text-sm tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                BoardVerse
              </p>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">Cafe Admin</p>
            </div>
          </div>

          {/* Menus */}
          <nav className="px-3 py-6 flex flex-col gap-1.5">
            {[
              { id: "pos", label: "POS", Icon: ShoppingBag },
              { id: "orders", label: "Incoming Orders", Icon: Bell },
              { id: "sessions", label: "Sessions", Icon: Clock },
              { id: "games", label: "Board Games", Icon: Dices },
              { id: "settings", label: "Settings", Icon: Settings },
            ].map(m => {
              const isActive = activeMenu === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMenu(m.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors relative"
                  style={{
                    background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                    color: isActive ? "#60A5FA" : "rgba(255,255,255,0.6)"
                  }}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#3B82F6] rounded-r-md" />
                  )}
                  <m.Icon size={17} strokeWidth={1.6} />
                  <span className="text-sm font-semibold">{m.label}</span>
                  {m.id === "orders" && unreadOrdersCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white animate-pulse">
                      {unreadOrdersCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center text-[#60A5FA] shrink-0">
              <User size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-white text-xs font-bold">Kasir Utama</p>
              <span className="text-[9px] bg-[#3B82F6] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider mt-0.5 inline-block">
                KASIR
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Spacer to prevent content overlapping under fixed sidebar */}
      <div className="hidden lg:block w-[220px] shrink-0" />

      {/* ── 2. CUSTOMERS PANEL (Middle Left) ─────────────────────── */}
      {activeMenu === "pos" ? (
        <>
          <section className="hidden md:flex w-[260px] shrink-0 border-r border-[#E2E8F0] bg-white flex-col justify-between">
            <div className="p-4 flex flex-col flex-1 overflow-hidden">
              <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A] mb-3">
                Customers
              </h2>

              {/* Customer Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* Customers List */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
                {filteredCustomers.map(c => {
                  const isSelected = selectedCustomer?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left border cursor-pointer transition-all"
                      style={{
                        borderColor: isSelected ? "#3B82F6" : "#F1F5F9",
                        background: isSelected ? "#EFF6FF" : "transparent"
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ background: isSelected ? "#3B82F6" : "#94A3B8" }}
                      >
                        <User size={14} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1E293B] truncate">{c.name}</p>
                        <p className="text-[10px] text-[#64748B]">{c.phone}</p>
                      </div>
                      {c.active && (
                        <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
                {filteredCustomers.length === 0 && (
                  <p className="text-xs text-[#94A3B8] text-center py-6">Customer tidak ditemukan.</p>
                )}
              </div>
            </div>

            {/* Add Customer Button */}
            <div className="p-4 border-t border-[#F1F5F9]">
              <button
                onClick={() => setShowAddCustomer(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-[#3B82F6] hover:border-solid hover:bg-[#F0F9FF] text-[#3B82F6] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                Register New Customer
              </button>
            </div>
          </section>

          {/* ── 3. POS MAIN CONTENT (Middle Center) ──────────────────── */}
          <main className="flex-1 flex flex-col overflow-hidden bg-white">

            {/* POS Header / Tabs */}
            <header className="border-b border-[#E2E8F0] px-4 md:px-6 py-3 shrink-0 flex items-center justify-between bg-white">
              <div className="flex gap-4">
                <button
                  onClick={() => { setActiveTab("f&b"); setSelectedCategory("All"); }}
                  className="px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer"
                  style={{
                    borderColor: activeTab === "f&b" ? "#3B82F6" : "transparent",
                    color: activeTab === "f&b" ? "#3B82F6" : "#64748B"
                  }}
                >
                  F&B Order
                </button>
                <button
                  onClick={() => { setActiveTab("rent"); setSelectedCategory("All"); }}
                  className="px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer"
                  style={{
                    borderColor: activeTab === "rent" ? "#3B82F6" : "transparent",
                    color: activeTab === "rent" ? "#3B82F6" : "#64748B"
                  }}
                >
                  Rent Game
                </button>
              </div>

              {/* Search bar inside header */}
              <div className="relative w-44 md:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
                <input
                  type="text"
                  placeholder={`Cari ${activeTab === "f&b" ? "makanan" : "board game"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </header>

            {/* Categories Pills */}
            <div className="px-4 md:px-6 py-3.5 shrink-0 flex gap-2 overflow-x-auto border-b border-[#F1F5F9] bg-[#FAFCFF] scrollbar-none">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border"
                    style={{
                      background: isSelected ? "#3B82F6" : "white",
                      color: isSelected ? "white" : "#64748B",
                      borderColor: isSelected ? "#3B82F6" : "#E2E8F0"
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FAFCFF]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {itemsToDisplay.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden rounded-2xl h-44 flex flex-col justify-between p-4 border border-slate-200/40 shadow-sm group cursor-pointer"
                  >
                    {/* Full Card Background Image */}
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop&q=80"}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop&q=80";
                      }}
                    />
                    {/* Dark Gradient Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                    {/* Status Overlay if unavailable */}
                    {(item.status === "Out of Stock" || item.status === "Maintenance" || item.active === false) && (
                      <div className="absolute inset-0 bg-slate-900/80 z-20 flex flex-col items-center justify-center text-center p-2">
                        <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm mb-1">
                          {item.status === "Out of Stock" ? "Out of Stock" : item.status === "Maintenance" ? "Maintenance" : "Nonaktif"}
                        </span>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                      <div>
                        <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h3 className="text-sm font-black text-white mt-1.5 leading-snug drop-shadow" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-extrabold text-white drop-shadow">{formatRupiah(item.price)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          disabled={item.status === "Out of Stock" || item.status === "Maintenance" || item.active === false}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-500 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow cursor-pointer active:scale-95 z-30"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {itemsToDisplay.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-4xl mb-3">🔍</span>
                  <p className="text-sm text-[#94A3B8]">Tidak ada item yang cocok dengan filter.</p>
                </div>
              )}
            </div>
          </main>

          {/* ── 4. ORDER SUMMARY PANEL (Right) ───────────────────────── */}
          <section className="w-[320px] shrink-0 border-l border-[#E2E8F0] bg-white flex flex-col justify-between">

            {/* Cart Header */}
            <div className="p-4 border-b border-[#E2E8F0] shrink-0">
              <div className="flex items-center justify-between">
                <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                 Order Summary
                </h2>
                {selectedCustomer && (
                  <span className="bg-[#EFF6FF] text-[#3B82F6] text-[10px] font-black px-2 py-0.5 rounded-md">
                    Customer Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-1 truncate">
                {selectedCustomer ? `Atas Nama: ${selectedCustomer.name}` : "Pilih customer dari list sebelah kiri"}
              </p>
            </div>

            {/* Cart List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300/40 overflow-hidden flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm select-none">{item.emoji}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate leading-tight">{item.name}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{formatRupiah(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-5 h-5 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-bold text-[#1E293B] w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
                  <ShoppingBag size={32} strokeWidth={1.5} className="text-[#94A3B8] mb-2.5" />
                  <p className="text-xs text-[#94A3B8]">Keranjang belanja kosong.</p>
                  <p className="text-[10px] text-[#CBD5E1] mt-1 max-w-[180px]">Pilih makanan atau board game untuk disewa.</p>
                </div>
              )}
            </div>

            {/* Payment & Checkout Footer */}
            <div className="p-4 border-t border-[#E2E8F0] shrink-0 bg-[#FAFAFC]">

              {/* Payment Type Selection */}
              <div className="mb-4">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod("Cash")}
                    className="py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
                    style={{
                      borderColor: paymentMethod === "Cash" ? "#3B82F6" : "#E2E8F0",
                      background: paymentMethod === "Cash" ? "#EFF6FF" : "white",
                      color: paymentMethod === "Cash" ? "#3B82F6" : "#64748B"
                    }}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod("QRIS")}
                    className="py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
                    style={{
                      borderColor: paymentMethod === "QRIS" ? "#3B82F6" : "#E2E8F0",
                      background: paymentMethod === "QRIS" ? "#EFF6FF" : "white",
                      color: paymentMethod === "QRIS" ? "#3B82F6" : "#64748B"
                    }}
                  >
                    QRIS
                  </button>
                </div>
              </div>

              {/* Pricing Breakdowns */}
              <div className="flex justify-between items-center text-xs text-[#64748B] mb-1.5">
                <span>Subtotal</span>
                <span>{formatRupiah(cartTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-[#0F172A] mb-4 pt-1.5 border-t border-dashed border-[#E2E8F0]">
                <span>TOTAL</span>
                <span className="text-base text-[#3B82F6]">{formatRupiah(cartTotal)}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle size={16} />
                Checkout & Print Receipt
              </button>
            </div>
          </section>
        </>
      ) : activeMenu === "orders" ? (
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC] p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0 text-left">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Incoming Orders</h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#3B82F6] text-xs font-bold border border-blue-100">
                {unreadOrdersCount} pending
              </span>
            </div>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto pr-1 pb-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {customerOrders.map(order => (
                <div 
                  key={order.id} 
                  className={`bg-white border rounded-[24px] p-5 shadow-sm flex flex-col justify-between h-[340px] transition-all ${
                    order.status === "paid" ? "border-blue-300 ring-2 ring-blue-50" : "border-[#E2E8F0]"
                  }`}
                >
                  <div>
                    {/* Order Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 mb-3.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#1E293B] leading-tight">{order.customerName}</h3>
                          <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {order.table}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748B] mt-0.5">{order.customerPhone}</p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                          order.status === "paid" ? "bg-blue-50 text-blue-600 border-blue-100" :
                          order.status === "in_progress" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {order.status === "paid" ? "PAID (Baru)" :
                           order.status === "in_progress" ? "Diterima / Aktif" : "Selesai"}
                        </span>
                        <p className="text-[9px] text-[#94A3B8] mt-1">
                          {new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-slate-600">{item.quantity}x {item.name}</span>
                          <span className="font-semibold text-slate-800">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                        </div>
                      ))}

                      {order.rentals?.map((rental: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-[#3B82F6]">
                          <span className="font-semibold flex items-center gap-1">
                            <Dices size={12} /> {rental.name} ({rental.duration || "2 Jam"})
                          </span>
                          <span className="font-black">Rp {rental.price.toLocaleString("id-ID")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Actions */}
                  <div className="border-t border-slate-100 pt-3.5 mt-3">
                    <div className="flex justify-between items-center text-xs mb-3.5 font-bold">
                      <span className="text-slate-500">Total Tagihan ({order.paymentMethod}):</span>
                      <span className="text-sm text-[#3B82F6]">Rp {order.totalAmount.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="flex gap-2">
                      {order.status === "paid" ? (
                        <>
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleAcceptOrder(order)}
                            className="flex-1 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer text-center"
                          >
                            Terima Order {order.rentals?.length > 0 ? "& Mulai Sesi" : ""}
                          </button>
                        </>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed text-center border border-slate-200/60"
                        >
                          Telah Diproses
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {customerOrders.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <Bell size={40} className="text-slate-300 mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-[#94A3B8]">Tidak ada pesanan masuk.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : activeMenu === "sessions" ? (
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC] p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Active Sessions</h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                {sessions.length} active
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filters */}
              <div className="flex items-center bg-[#F1F5F9]/60 p-1 rounded-xl border border-slate-200">
                {(["All", "Ending Soon", "All Day"] as const).map(filter => {
                  const isActive = sessionFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setSessionFilter(filter)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      style={{
                        background: isActive ? "white" : "transparent",
                        color: isActive ? "#3B82F6" : "#64748B",
                        boxShadow: isActive ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" : "none"
                      }}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              {/* Start Session Button */}
              <button
                onClick={() => setShowAddSession(true)}
                className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 animate-none"
              >
                <Plus size={14} /> Start New Session
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-y-auto pr-1 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {filteredSessions.map(session => (
                <div key={session.id} className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[300px]">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-100 flex items-center justify-center shrink-0">
                        <User size={18} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#1E293B] truncate leading-tight">{session.name}</h3>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{session.phone}</p>
                      </div>
                    </div>
                    <span className="bg-[#EFF6FF] text-[#3B82F6] text-xs font-bold px-2.5 py-1 rounded-lg shrink-0">
                      {session.table}
                    </span>
                  </div>

                  {/* Shaded Game Section */}
                  {(() => {
                    const gameData = RENT_GAMES.find(g => g.name.toLowerCase() === session.game.toLowerCase());
                    return (
                      <div className="relative overflow-hidden rounded-2xl h-12 flex items-center px-4 mt-4 border border-slate-200/40 shadow-sm">
                        {gameData?.image ? (
                          <>
                            <img src={gameData.image} alt={session.game} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-[#EFF6FF]" />
                        )}
                        <div className="relative z-10 flex items-center gap-2">
                          <Dices size={13} strokeWidth={1.6} className={gameData?.image ? "text-white/80" : "text-[#3B82F6]"} />
                          <span className={`text-xs font-bold truncate ${gameData?.image ? "text-white drop-shadow" : "text-[#1E293B]"}`}>
                            {session.game}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Timer Display */}
                  <div className="flex flex-col items-center justify-center my-4">
                    <span className="text-3xl font-extrabold text-[#10B981] tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {formatTime(session.secondsLeft)}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      <Clock size={11} strokeWidth={2} />
                      {session.duration}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => {
                        setConfirmAction("end");
                        setConfirmTargetId(session.id);
                        setConfirmTargetName(session.name);
                        setShowConfirmModal(true);
                      }}
                      className="flex-1 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-500 text-xs font-bold transition-all cursor-pointer"
                    >
                      End Session
                    </button>
                    <button
                      onClick={() => {
                        setConfirmAction("extend");
                        setExtendOption("1 Hour");
                        setConfirmTargetId(session.id);
                        setConfirmTargetName(session.name);
                        setShowConfirmModal(true);
                      }}
                      className="flex-1 py-2 rounded-xl border border-blue-200 hover:bg-blue-50 text-[#3B82F6] text-xs font-bold transition-all cursor-pointer"
                    >
                      Extend
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredSessions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Clock size={40} className="text-slate-300 mb-3" strokeWidth={1.5} />
                <p className="text-sm text-[#94A3B8]">Tidak ada sesi aktif.</p>
              </div>
            )}
          </div>

          {/* Bottom Statistics Banner */}
          <div className="shrink-0 bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between shadow-sm mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Check size={16} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-[#1E293B]">
                {completedSessionsCount} sessions completed today
              </span>
            </div>
            <div className="text-sm font-bold text-[#64748B]">
              Rental Revenue: <span className="text-base text-[#3B82F6] font-black">{formatRupiah(rentalRevenue)}</span>
            </div>
          </div>
        </main>
      ) : activeMenu === "games" ? (
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC] p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Board Game Collection</h1>
              <span className="bg-blue-50 text-[#3B82F6] text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                {boardGames.length} games
              </span>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Search games */}
              <div className="relative w-48 sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchGameQuery}
                  onChange={(e) => setSearchGameQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* View Layout Toggle */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
                <button
                  onClick={() => setGameLayoutView("grid")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${gameLayoutView === "grid" ? "bg-slate-100 text-[#3B82F6]" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <span className="block w-4 h-4 text-xs font-black">⊞</span>
                </button>
                <button
                  onClick={() => setGameLayoutView("list")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${gameLayoutView === "list" ? "bg-slate-100 text-[#3B82F6]" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <span className="block w-4 h-4 text-xs font-black">≡</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-col gap-3 mb-6 shrink-0">
            {/* Status Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {(["All", "Available", "In Use", "Maintenance"] as const).map(filter => {
                const isActive = selectedStatusFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedStatusFilter(filter)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border"
                    style={{
                      background: isActive ? "#3B82F6" : "white",
                      color: isActive ? "white" : "#64748B",
                      borderColor: isActive ? "#3B82F6" : "#E2E8F0"
                    }}
                  >
                    {filter}
                  </button>
                );
              })}

              <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

              {/* Category Filters */}
              {(["All", "Strategy", "Family", "Party", "Card", "Cooperative"] as const).map(filter => {
                const isActive = selectedCategoryFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedCategoryFilter(filter)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border"
                    style={{
                      background: isActive ? "#EFF6FF" : "white",
                      color: isActive ? "#3B82F6" : "#64748B",
                      borderColor: isActive ? "#3B82F6" : "#E2E8F0"
                    }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collection Grid / List */}
          <div className="flex-1 overflow-y-auto pr-1 pb-6">
            {gameLayoutView === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filteredBoardGames.map(game => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedDetailGame(game)}
                    className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[340px] cursor-pointer hover:-translate-y-0.5 text-left"
                  >
                    {/* Top image area */}
                    <div className="relative h-44 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="h-full max-h-[120px] object-contain drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
                      />
                      {/* Status Overlay */}
                      <span
                        className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${
                          game.status === "Available"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : game.status === "In Use"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {game.status}
                      </span>

                      {/* If In Use, show current customer */}
                      {game.status === "In Use" && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm px-4 py-1.5 text-center text-[10px] font-bold text-white truncate">
                          {game.currentUser} · Ends {game.endTime}
                        </div>
                      )}
                    </div>

                    {/* Bottom Info Area */}
                    <div className="p-4 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <h3 className="text-sm font-bold text-[#1E293B] truncate leading-tight mb-1">{game.name}</h3>
                        
                        {/* Rating row */}
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <span className="text-amber-400 text-xs">★</span>
                          <span className="text-[11px] font-bold text-[#64748B]">{game.rating}</span>
                        </div>

                        {/* Specs row */}
                        <div className="flex items-center gap-3 text-[11px] font-bold text-[#64748B] mb-3">
                          <span className="flex items-center gap-1">
                            <User size={12} strokeWidth={2} />
                            {game.players} players
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} strokeWidth={2} />
                            {game.duration}
                          </span>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-auto shrink-0">
                        <span className="text-[10px] bg-blue-50 text-[#3B82F6] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide">
                          {game.category}
                        </span>
                        
                        {game.status === "Available" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDetailGame(game);
                            }}
                            className="px-3.5 py-1.5 border border-blue-200 hover:bg-blue-50 text-[#3B82F6] text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Rent
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold italic">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List layout
              <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500">
                      <th className="p-4">Game</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Players</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBoardGames.map(game => (
                      <tr
                        key={game.id}
                        onClick={() => setSelectedDetailGame(game)}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        <td className="p-4 font-bold text-[#1E293B] flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="truncate max-w-[150px]">{game.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-50 text-[#3B82F6] px-2.5 py-0.5 rounded-md font-bold uppercase text-[9px] tracking-wide">
                            {game.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-amber-500">★ {game.rating}</td>
                        <td className="p-4 text-slate-500 font-medium">{game.players} Players</td>
                        <td className="p-4 text-slate-500 font-medium">{game.duration}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wide inline-block ${
                            game.status === "Available"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : game.status === "In Use"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}>
                            {game.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {game.status === "Available" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDetailGame(game);
                              }}
                              className="px-3 py-1.5 border border-blue-200 hover:bg-blue-50 text-[#3B82F6] text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Rent
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold italic">Unavailable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {filteredBoardGames.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-3xl mb-3">🎲</span>
                <p className="text-sm text-[#94A3B8]">Tidak ada game yang cocok dengan filter.</p>
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#FAFCFF]">
          <p className="text-slate-500 font-semibold">Halaman {activeMenu} sedang dalam pengembangan.</p>
        </div>
      )}

      {/* ── 5. MODAL: ADD CUSTOMER ───────────────────────────────── */}
      <AnimatePresence>
        {showAddCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddCustomer(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>

              <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-lg font-black text-[#0F172A] mb-4">
                Register New Customer
              </h3>

              <form onSubmit={handleAddCustomer} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold shadow transition-colors cursor-pointer mt-2"
                >
                  Register & Select Customer
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 6. MODAL: RECEIPT SUCCESS OVERLAY ─────────────────────── */}
      <AnimatePresence>
        {showCheckoutSuccess && lastReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
            {/* Custom media query style block to only print the receipt area */}
            <style dangerouslySetInnerHTML={{
              __html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #print-receipt-area, #print-receipt-area * {
                  visibility: visible !important;
                }
                #print-receipt-area {
                  position: absolute !important;
                  left: 50% !important;
                  top: 0 !important;
                  transform: translateX(-50%) !important;
                  width: 80mm !important;
                  max-width: 80mm !important;
                  box-shadow: none !important;
                  border: none !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  background: white !important;
                  color: black !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}} />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative my-8"
              id="print-receipt-area"
            >
              {/* Receipt Structure */}
              <div className="flex flex-col items-center text-center">
                <img src={sebangkuLogo} alt="Logo" className="w-10 h-10 object-contain mb-2" />
                <h4 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-black text-[#0F172A] tracking-tight">
                  BoardVerse
                </h4>
                <p className="text-[10px] text-[#64748B] font-medium leading-none mt-1">Jl. Meja Hijau No. 42, Jakarta</p>
                <p className="text-[10px] text-[#94A3B8] font-medium mt-1">{lastReceipt.dateDisplay}</p>
              </div>

              {/* Dashed line divider */}
              <div className="w-full border-t border-dashed border-[#CBD5E1] my-4" />

              {/* Receipt Body */}
              <div className="text-[11px] text-[#334155] flex flex-col gap-2.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {/* F&B Items */}
                {lastReceipt.fbItems.map((it: any) => (
                  <div key={it.id} className="flex justify-between items-baseline gap-2">
                    <span className="font-semibold text-[#1E293B]">{it.quantity}× {it.name}</span>
                    <span className="font-bold text-slate-700 shrink-0">{formatRupiah(it.price * it.quantity)}</span>
                  </div>
                ))}

                {/* Rental Items */}
                {lastReceipt.rentItems.map((it: any) => (
                  <div key={it.id} className="flex justify-between items-baseline gap-2 text-[#2563EB] italic">
                    <span>Game Rental — {it.name} ({it.quantity} hrs)</span>
                    <span className="font-bold shrink-0">{formatRupiah(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Dashed line divider */}
              <div className="w-full border-t border-dashed border-[#CBD5E1] my-4" />

              {/* Breakdown */}
              <div className="text-[11px] text-[#64748B] flex flex-col gap-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="flex justify-between">
                  <span>Subtotal F&B</span>
                  <span>{formatRupiah(lastReceipt.subtotalFB)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rental Cost</span>
                  <span>{formatRupiah(lastReceipt.rentalCost)}</span>
                </div>

                {/* Big Total */}
                <div className="flex justify-between items-center text-sm font-black text-[#0F172A] mt-2 pt-2 border-t border-dashed border-[#E2E8F0]">
                  <span>TOTAL</span>
                  <span className="text-base text-[#0F172A]">{formatRupiah(lastReceipt.total)}</span>
                </div>
              </div>

              {/* Paid via info */}
              <div className="text-center mt-3 text-[10px] font-bold text-[#64748B] tracking-wide">
                Paid via <span className="text-[#0F172A] font-extrabold">{lastReceipt.paymentMethod}</span>
              </div>

              {/* Rental Recap card (if game is rented) */}
              {lastReceipt.rentedGame && (
                <div className="mt-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col gap-1 text-[10px] text-[#475569]">
                  <p className="font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 mb-1 text-[9px]">
                    🎲 Rental Recap
                  </p>
                  <div className="flex justify-between">
                    <span className="font-medium text-[#64748B]">Game:</span>
                    <span className="font-bold text-[#1E293B]">{lastReceipt.rentedGame.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-[#64748B]">Duration:</span>
                    <span className="font-bold text-[#1E293B]">{lastReceipt.durationHours} hours · End: {lastReceipt.endTimeDisplay}</span>
                  </div>
                </div>
              )}

              {/* Thank you note */}
              <div className="text-center mt-4 text-[10px] font-bold text-[#3B82F6] tracking-wide">
                Thank you for playing! See you next time 🎲
              </div>

              {/* Barcode Mock */}
              <div className="mt-4 flex flex-col items-center">
                <p className="text-[8px] font-bold text-[#94A3B8] tracking-widest mb-1.5">{lastReceipt.id}</p>
                <div className="bg-[#0F2340] w-full p-2.5 rounded-xl flex items-center justify-center gap-[1.5px] h-9">
                  {Array.from({ length: 32 }).map((_, idx) => {
                    const widths = ["w-[1px]", "w-[1.5px]", "w-[2px]", "w-[3px]"];
                    const randomWidth = widths[(idx * 7 + 11) % widths.length];
                    const isSpacing = (idx * 3 + 5) % 7 === 0;
                    return (
                      <div
                        key={idx}
                        className={`h-full ${randomWidth} ${isSpacing ? 'bg-[#0F2340]' : 'bg-white/90'}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-2.5 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl border border-[#3B82F6] hover:bg-[#EFF6FF] text-[#3B82F6] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer size={13} />
                  Print
                </button>
                <button
                  onClick={() => setShowCheckoutSuccess(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check size={13} />
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 7. MODAL: QRIS SCAN SIMULATOR ──────────────────────────── */}
      <AnimatePresence>
        {showQRISModal && pendingReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative flex flex-col items-center"
            >
              {/* Header */}
              <div className="text-center w-full mb-4">
                <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-black text-[#0F172A] tracking-tight">
                  Pembayaran QRIS
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Scan untuk menyelesaikan transaksi</p>
              </div>

              {/* Amount Display */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl w-full p-4 text-center mb-5">
                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">TOTAL TAGIHAN</p>
                <p className="text-2xl font-black text-[#3B82F6] mt-0.5">
                  {formatRupiah(pendingReceipt.total)}
                </p>
                <p className="text-[10px] text-[#64748B] mt-1 truncate">
                  Customer: <span className="font-bold text-[#1E293B]">{pendingReceipt.customer}</span>
                </p>
              </div>

              {/* QR Code Container */}
              <div className="relative w-48 h-48 bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-center shadow-inner mb-5">
                {/* Stylized QR Code SVG */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90 select-none">
                  {/* Position detection markers */}
                  <rect x="0" y="0" width="25" height="25" fill="#0F2340" rx="3" />
                  <rect x="5" y="5" width="15" height="15" fill="white" rx="2" />
                  <rect x="9" y="9" width="7" height="7" fill="#3B82F6" rx="1" />

                  <rect x="75" y="0" width="25" height="25" fill="#0F2340" rx="3" />
                  <rect x="80" y="5" width="15" height="15" fill="white" rx="2" />
                  <rect x="84" y="9" width="7" height="7" fill="#3B82F6" rx="1" />

                  <rect x="0" y="75" width="25" height="25" fill="#0F2340" rx="3" />
                  <rect x="5" y="80" width="15" height="15" fill="white" rx="2" />
                  <rect x="9" y="84" width="7" height="7" fill="#3B82F6" rx="1" />

                  {/* Tiny mock QR dots */}
                  <rect x="35" y="0" width="6" height="6" fill="#0F2340" />
                  <rect x="45" y="5" width="8" height="4" fill="#0F2340" />
                  <rect x="60" y="10" width="4" height="8" fill="#0F2340" />

                  <rect x="30" y="30" width="12" height="12" fill="#0F2340" />
                  <rect x="34" y="34" width="4" height="4" fill="white" />

                  <rect x="50" y="35" width="18" height="6" fill="#0F2340" />
                  <rect x="55" y="45" width="6" height="14" fill="#0F2340" />
                  <rect x="40" y="60" width="15" height="6" fill="#3B82F6" />

                  <rect x="70" y="70" width="14" height="14" fill="#0F2340" />
                  <rect x="74" y="74" width="6" height="6" fill="white" />

                  <rect x="30" y="80" width="8" height="12" fill="#0F2340" />
                  <rect x="48" y="75" width="14" height="4" fill="#0F2340" />
                  <rect x="80" y="45" width="12" height="12" fill="#0F2340" />

                  {/* QR Center Brand Logo Overlay */}
                  <rect x="38" y="38" width="24" height="24" fill="white" rx="6" />
                  <text x="50" y="53" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#3B82F6" fontFamily="sans-serif">QR</text>
                </svg>

                {/* Status Overlays */}
                <AnimatePresence>
                  {qrisStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-sm">
                        <Check size={28} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-black text-emerald-600">Scan Sukses!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Message */}
              <div className="flex items-center justify-center gap-2 mb-5">
                {qrisStatus === "pending" ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-[2px] border-slate-200 border-t-[#3B82F6] rounded-full shrink-0"
                    />
                    <span className="text-xs text-[#64748B] font-medium">Menunggu scan dari customer...</span>
                  </>
                ) : (
                  <span className="text-xs text-[#10B981] font-bold">Pembayaran Diterima & Berhasil!</span>
                )}
              </div>

              {/* Control Buttons */}
              <div className="w-full flex flex-col gap-2">
                {qrisStatus === "pending" && (
                  <button
                    onClick={() => {
                      setQrisStatus("success");
                      setTimeout(() => {
                        setShowQRISModal(false);
                        setLastReceipt(pendingReceipt);
                        setShowCheckoutSuccess(true);
                        setPendingReceipt(null);
                      }, 1500);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CheckCircle size={13} />
                    Simulasikan Scan Sukses
                  </button>
                )}

                <button
                  onClick={() => {
                    // Restore items back to cart if canceled
                    if (pendingReceipt) {
                      setCart(pendingReceipt.items);
                    }
                    setShowQRISModal(false);
                    setPendingReceipt(null);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X size={13} />
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 8. MODAL: START NEW SESSION ──────────────────────────── */}
      <AnimatePresence>
        {showAddSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddSession(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>

              <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-lg font-bold text-[#0F172A] mb-4">
                Start New Session
              </h3>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newSessionName || !newSessionPhone) return;
                
                let initialSeconds = 3600; // default 1 hour
                if (newSessionDuration === "2 Hours") initialSeconds = 7200;
                else if (newSessionDuration === "3 Hours") initialSeconds = 10800;
                else if (newSessionDuration === "All Day") initialSeconds = 28800; // 8 hours

                const newSession = {
                  id: Date.now(),
                  name: newSessionName,
                  phone: newSessionPhone,
                  table: newSessionTable,
                  game: newSessionGame,
                  duration: newSessionDuration,
                  secondsLeft: initialSeconds
                };

                setSessions(prev => [newSession, ...prev]);
                
                // Reset form
                setNewSessionName("");
                setNewSessionPhone("");
                setNewSessionTable("A1");
                setNewSessionGame("Pandemic");
                setNewSessionDuration("2 Hours");
                setShowAddSession(false);
              }} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="Nama Customer"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newSessionPhone}
                    onChange={(e) => setNewSessionPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                      Table Number
                    </label>
                    <select
                      value={newSessionTable}
                      onChange={(e) => setNewSessionTable(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#3B82F6]"
                    >
                      {["A1", "A2", "B1", "B2", "B3", "C1", "C2", "D1"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                      Duration
                    </label>
                    <select
                      value={newSessionDuration}
                      onChange={(e) => setNewSessionDuration(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#3B82F6]"
                    >
                      {["1 Hour", "2 Hours", "3 Hours", "All Day"].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                    Board Game
                  </label>
                  <select
                    value={newSessionGame}
                    onChange={(e) => setNewSessionGame(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#3B82F6]"
                  >
                    {RENT_GAMES.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold shadow transition-colors cursor-pointer mt-2"
                >
                  Start Session
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 9. MODAL: CONFIRM ACTION ─────────────────────────────── */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>

              <h3 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A] text-left mb-4">
                {confirmAction === "end" ? "End Session" : "Extend Session"}
              </h3>

              {/* User Profile Info Card inside Modal */}
              <div className="bg-[#EFF6FF]/70 border border-[#EFF6FF] rounded-2xl p-4 flex items-center gap-3.5 mb-5 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-100 flex items-center justify-center shrink-0">
                  <User size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B] leading-tight">{confirmTargetName}</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    {(() => {
                      const sObj = sessions.find(s => s.id === confirmTargetId);
                      return sObj ? `${sObj.table} · ${sObj.game}` : "";
                    })()}
                  </p>
                </div>
              </div>

              {confirmAction === "extend" ? (
                <div className="mb-6 text-left">
                  <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-3">
                    Choose Extension
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["30 min", "1 Hour", "2 Hours"] as const).map(opt => {
                      const isActive = extendOption === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setExtendOption(opt)}
                          className="py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center whitespace-nowrap"
                          style={{
                            borderColor: isActive ? "#3B82F6" : "#E2E8F0",
                            background: isActive ? "#EFF6FF" : "white",
                            color: isActive ? "#3B82F6" : "#64748B",
                            boxShadow: isActive ? "0 1px 3px 0 rgba(0, 0, 0, 0.1)" : "none"
                          }}
                        >
                          {opt === "30 min" ? "+30 min" : `+${opt}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#64748B] text-left mb-6 leading-relaxed">
                  Apakah Anda yakin ingin mengakhiri sesi bermain untuk pelanggan ini? Seluruh waktu bermain akan dihentikan dan recap transaksi akan diselesaikan.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmTargetId !== null) {
                      if (confirmAction === "end") {
                        handleEndSession(confirmTargetId);
                      } else if (confirmAction === "extend") {
                        handleExtendSession(confirmTargetId, extendOption);
                      }
                    }
                    setShowConfirmModal(false);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition-all cursor-pointer ${
                    confirmAction === "end"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[#3B82F6] hover:bg-[#2563EB]"
                  }`}
                >
                  {confirmAction === "end" ? "Confirm End" : "Confirm Extend"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 10. MODAL: BOARD GAME DETAIL ────────────────────────── */}
      <AnimatePresence>
        {selectedDetailGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[440px] bg-white rounded-[28px] overflow-hidden shadow-2xl relative"
            >
              {/* Header Image & Status Area */}
              <div className="relative h-52 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center p-8 overflow-hidden">
                <img
                  src={selectedDetailGame.image}
                  alt={selectedDetailGame.name}
                  className="h-full max-h-[140px] object-contain drop-shadow-xl z-10"
                />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedDetailGame(null)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>

                {/* Category Badge */}
                <span className="absolute bottom-4 left-4 z-20 text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedDetailGame.category}
                </span>

                {/* Status Badge */}
                <span
                  className={`absolute bottom-4 right-4 z-20 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${
                    selectedDetailGame.status === "Available"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : selectedDetailGame.status === "In Use"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}
                >
                  {selectedDetailGame.status}
                </span>
              </div>

              {/* Game Info Details */}
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-[#0F172A] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {selectedDetailGame.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="text-amber-400 text-sm">★</span>
                  <span className="text-xs font-bold text-[#64748B]">{selectedDetailGame.rating}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#64748B] leading-relaxed mb-6">
                  {selectedDetailGame.description || `${selectedDetailGame.name} adalah board game berkualitas tinggi untuk dimainkan bersama keluarga dan teman.`}
                </p>

                {/* Specs Box */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
                    <Users size={18} className="text-[#3B82F6] mb-2" strokeWidth={1.8} />
                    <span className="text-xs font-bold text-[#1E293B]">{selectedDetailGame.players}</span>
                    <span className="text-[10px] text-[#94A3B8] font-bold mt-0.5">Players</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
                    <Clock size={18} className="text-[#3B82F6] mb-2" strokeWidth={1.8} />
                    <span className="text-xs font-bold text-[#1E293B]">{selectedDetailGame.duration}</span>
                    <span className="text-[10px] text-[#94A3B8] font-bold mt-0.5">Duration</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
                    <Tag size={18} className="text-[#3B82F6] mb-2" strokeWidth={1.8} />
                    <span className="text-xs font-bold text-[#1E293B]">{selectedDetailGame.minAge || "6+"}</span>
                    <span className="text-[10px] text-[#94A3B8] font-bold mt-0.5">Min Age</span>
                  </div>
                </div>

                {/* Complexity Row */}
                <div className="flex items-center gap-2 mb-6 text-xs font-bold">
                  <span className="text-[#64748B]">Complexity:</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${
                    selectedDetailGame.complexity === "Easy"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : selectedDetailGame.complexity === "Medium"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}>
                    {selectedDetailGame.complexity || "Easy"}
                  </span>
                </div>

                {/* Action Button */}
                {selectedDetailGame.status === "Available" ? (
                  <button
                    onClick={() => {
                      setNewSessionGame(selectedDetailGame.name);
                      setActiveMenu("sessions");
                      setShowAddSession(true);
                      setSelectedDetailGame(null);
                    }}
                    className="w-full py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold shadow transition-colors cursor-pointer text-center"
                  >
                    Rent this Game
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-[#E2E8F0] text-[#94A3B8] text-xs font-bold cursor-not-allowed text-center"
                  >
                    Game is Currently {selectedDetailGame.status}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
