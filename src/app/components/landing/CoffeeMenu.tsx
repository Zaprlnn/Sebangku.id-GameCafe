import { useState } from "react";

const MENU_ITEMS = [
  { id: 1, name: "Kopi Susu Aren", price: 28000, badge: "🔥 Bestseller", temp: "hot", category: "Espresso Base", desc: "Aren pilihan, susu segar, espresso", image: "https://images.unsplash.com/photo-1767439327066-36be4e6f0fe4?w=400&q=80" },
  { id: 2, name: "Matcha Latte", price: 32000, badge: "🍵 Trending", temp: "both", category: "Cold & Iced", desc: "Grade ceremonial, earthly & rich", image: "https://images.unsplash.com/photo-1634473115412-8fa5b647ef59?w=400&q=80" },
  { id: 3, name: "Cold Brew", price: 35000, badge: "❄️ Cold Only", temp: "cold", category: "Cold & Iced", desc: "Diseduh 18 jam, smooth tanpa pahit", image: "https://images.unsplash.com/photo-1759259639356-6eee63241869?w=400&q=80" },
  { id: 4, name: "Cappuccino", price: 30000, badge: "⭐ Favorit", temp: "hot", category: "Espresso Base", desc: "Foam lembut, espresso seimbang", image: "https://images.unsplash.com/photo-1623086923609-594e98bb0bff?w=400&q=80" },
  { id: 5, name: "Americano", price: 22000, badge: "☕ Klasik", temp: "hot", category: "Espresso Base", desc: "Bold, clean, no nonsense", image: "https://images.unsplash.com/photo-1759259639356-6eee63241869?w=400&q=80" },
  { id: 6, name: "Es Teh Tarik", price: 15000, badge: "🫖 Segar", temp: "cold", category: "Cold & Iced", desc: "Teh pekat ditarik manual", image: "https://images.unsplash.com/photo-1767439327066-36be4e6f0fe4?w=400&q=80" },
  { id: 7, name: "Sebangku Special", price: 45000, badge: "🎲 Khas Kami", temp: "both", category: "Signature", desc: "Minuman signature eksklusif", image: "https://images.unsplash.com/photo-1749104028327-a33087ea4f47?w=400&q=80" },
  { id: 8, name: "Game Night Bundle", price: 89000, badge: "🎮 Bundle", temp: "both", category: "Signature", desc: "Paket hemat gaming seru", image: "https://images.unsplash.com/photo-1706295331319-8ec5da63cb91?w=400&q=80" },
];

const CATEGORIES = ["Semua", "Espresso Base", "Cold & Iced", "Signature"];

const CATEGORY_EMOJI = {
  "Espresso Base": "☕",
  "Cold & Iced": "🧊",
  "Signature": "🎲",
};

export default function CoffeeMenu() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filteredItems = activeFilter === "Semua" 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeFilter);

  const getTempBadge = (temp: string) => {
    if (temp === "hot") return { emoji: "🔥", color: "bg-red-100", textColor: "text-red-600" };
    if (temp === "cold") return { emoji: "❄️", color: "bg-blue-100", textColor: "text-blue-600" };
    return { emoji: "✨", color: "bg-purple-100", textColor: "text-purple-600" };
  };

  return (
    <section className="py-20 px-5" style={{ backgroundColor: "#EBF5FF" }}>
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: "#EBF5FF", border: "2px solid #45A1FD" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "#45A1FD" }}>40+ VARIAN</span>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(26px, 4vw, 42px)", color: "#1C1410", marginBottom: 8 }}>
            Kopi & Minuman
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#6B4436", lineHeight: 1.6 }}>
            Dari espresso klasik hingga signature drink
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 justify-center flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                activeFilter === cat
                  ? "text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
              style={activeFilter === cat ? { backgroundColor: "#45A1FD" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {filteredItems.map(item => {
            const tempBadge = getTempBadge(item.temp);
            const categoryEmoji = CATEGORY_EMOJI[item.category as keyof typeof CATEGORY_EMOJI] || "🎲";

            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                {/* PHOTO PLACEHOLDER */}
                <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 aspect-video flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML += `<span className="text-5xl absolute">${categoryEmoji}</span>`;
                    }}
                  />
                  {/* Badge - pojok kiri atas */}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-bold">
                    {item.badge}
                  </div>
                  {/* Temp badge - pojok kanan atas */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${tempBadge.color} ${tempBadge.textColor}`}>
                    {tempBadge.emoji}
                  </div>
                </div>

                {/* BODY */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "16px", color: "#45A1FD" }}>
                      Rp {item.price.toLocaleString("id")}
                    </span>
                  </div>
                  <button className="w-full bg-blue-500 text-white rounded-xl py-2 font-semibold hover:bg-blue-600 transition-colors text-sm">
                    + Tambah Pesanan
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM STRIP */}
        <div className="py-6 px-8 rounded-2xl text-center text-white" style={{ background: "linear-gradient(to right, #45A1FD, #82C2FF)" }}>
          <p className="font-bold mb-2">Masih ada 30+ varian lainnya!</p>
          <button className="text-white hover:underline font-semibold">
            Lihat menu lengkap →
          </button>
        </div>
      </div>
    </section>
  );
}

