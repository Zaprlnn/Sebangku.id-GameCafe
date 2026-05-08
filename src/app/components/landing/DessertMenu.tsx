import { useState } from "react";

const DESSERT_ITEMS = [
  {
    id: 1,
    name: "Tiramisu",
    price: 42000,
    badge: "⭐ Best Seller",
    category: "Cake & Dessert",
    desc: "Espresso & mascarpone ringan",
    image: "https://images.unsplash.com/photo-1593545024944-b3c74435b9f3?w=400&q=80"
  },
  {
    id: 2,
    name: "Brownies Fudgy",
    price: 28000,
    badge: "🍫 Rich",
    category: "Cake & Dessert",
    desc: "Dark chocolate, dense & moist",
    image: "https://images.unsplash.com/photo-1654921913191-f535f8978768?w=400&q=80"
  },
  {
    id: 3,
    name: "Cheesecake Matcha",
    price: 38000,
    badge: "🍵 Trending",
    category: "Cake & Dessert",
    desc: "Matcha ceremonial, creamy filling",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"
  },
  {
    id: 4,
    name: "Croissant Butter",
    price: 25000,
    badge: "🥐 Klasik",
    category: "Pastry",
    desc: "Flaky, buttery, freshly baked",
    image: "https://images.unsplash.com/photo-1517957745394-9f0efc5b5c60?w=400&q=80"
  },
  {
    id: 5,
    name: "Banana Foster Waffle",
    price: 45000,
    badge: "🧇 Signature",
    category: "Waffle & Pancake",
    desc: "Waffle tebal, caramel pisang",
    image: "https://images.unsplash.com/photo-1724653213738-3fbc844cea14?w=400&q=80"
  },
  {
    id: 6,
    name: "Roti Bakar Selai",
    price: 18000,
    badge: "🍞 Simpel",
    category: "Pastry",
    desc: "Roti tebal, selai homemade",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80"
  },
  {
    id: 7,
    name: "Cookies & Cream Parfait",
    price: 35000,
    badge: "🎲 Khas Kami",
    category: "Signature",
    desc: "Oreo crumble, whipped cream layer",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80"
  },
  {
    id: 8,
    name: "Game Snack Bundle",
    price: 65000,
    badge: "🎮 Bundle",
    category: "Signature",
    desc: "Paket snack hemat buat gaming",
    image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd33c86?w=400&q=80"
  },
];

const CATEGORIES = ["Semua", "Cake & Dessert", "Pastry", "Waffle & Pancake", "Signature"];

const CATEGORY_EMOJI = {
  "Cake & Dessert": "🍰",
  "Pastry": "🥐",
  "Waffle & Pancake": "🧇",
  "Signature": "🎲",
};

export default function DessertMenu() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filteredItems = activeFilter === "Semua" 
    ? DESSERT_ITEMS 
    : DESSERT_ITEMS.filter(item => item.category === activeFilter);

  const categoryEmoji = (category: string) => CATEGORY_EMOJI[category as keyof typeof CATEGORY_EMOJI] || "🎲";

  return (
    <section className="py-20 px-5" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: "#EBF5FF", border: "2px solid #45A1FD" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "#45A1FD" }}>20+ VARIAN</span>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: "clamp(26px, 4vw, 42px)", color: "#1C1410", marginBottom: 8 }}>
            Dessert & Snack
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#6B4436", lineHeight: 1.6 }}>
            Teman sempurna saat sesi gaming panjang
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
            const emoji = categoryEmoji(item.category);

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                style={{ border: "1px solid #f0f0f0" }}
              >
                {/* PHOTO PLACEHOLDER */}
                <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 aspect-video flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML += `<span className="text-6xl absolute">${emoji}</span>`;
                    }}
                  />
                  {/* Badge - pojok kiri atas */}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#45A1FD", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "11px" }}>
                    {item.badge}
                  </div>
                  
                  {/* Emoji kategori - pojok kanan atas */}
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#EBF5FF" }}>
                    <span className="text-lg">{emoji}</span>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-5">
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "16px", color: "#1C1410", marginBottom: 4 }}>
                    {item.name}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B4436", lineHeight: 1.5, marginBottom: 12 }}>
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "18px", color: "#45A1FD" }}>
                      Rp {item.price.toLocaleString("id")}
                    </span>
                  </div>
                  <button 
                    className="w-full text-white rounded-full py-2 font-semibold transition-all text-sm"
                    style={{ backgroundColor: "#45A1FD", fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#82C2FF")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#45A1FD")}
                  >
                    + Tambah Pesanan
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM STRIP */}
        <div className="rounded-2xl text-center text-white py-6 px-8 max-w-2xl mx-auto"
          style={{ background: "linear-gradient(to right, #45A1FD, #82C2FF)" }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "16px", marginBottom: 8 }}>
            Masih ada 10+ pilihan dessert lainnya!
          </p>
          <button style={{ fontFamily: "'DM Sans', sans-serif", color: "white", cursor: "pointer" }} className="hover:underline">
            Lihat menu lengkap →
          </button>
        </div>
      </div>
    </section>
  );
}

