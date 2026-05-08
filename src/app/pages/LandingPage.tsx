import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, useInView } from "motion/react";
import {
  MapPin, Clock, Users, Coffee, Gamepad2,
  Zap, Trophy, Gift, Shield,
  Wifi, Heart, ArrowRight, Phone, Instagram, Twitter,
} from "lucide-react";
import LandingNavbar from "../components/landing/Navbar";
import LandingHeroSection from "../components/landing/HeroSection";
import CoffeeMenu from "../components/landing/CoffeeMenu";
import DessertMenu from "../components/landing/DessertMenu";
import GameLibrary from "../components/landing/GameLibrary";

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  WAVE DIVIDER
// ─────────────────────────────────────────────────────────────────────────────

function WaveDivider({ flip = false, fill = "#EBF5FF" }: { flip?: boolean; fill?: string }) {
  return (
    <div style={{ lineHeight: 0, transform: flip ? "scaleY(-1)" : undefined }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 60 }}>
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill={fill} />
      </svg>
    </div>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
//  STATS
// ─────────────────────────────────────────────────────────────────────────────

function StatsSection() {
  const stats = [
    { value: "50+", label: "Koleksi Board Game", icon: "🎲" },
    { value: "14", label: "Meja Tersedia", icon: "🪑" },
    { value: "1K+", label: "Member Aktif", icon: "👥" },
    { value: "4.9", label: "Rating Google", icon: "⭐" },
  ];
  return (
    <section style={{ backgroundColor: "#45A1FD" }} className="py-10 px-5">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.07}>
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl mb-1">{s.icon}</span>
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "34px", color: "white", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{s.label}</span>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  WHY SEBANGKU
// ─────────────────────────────────────────────────────────────────────────────

function WhySection() {
  const features = [
    { icon: Gamepad2, title: "50+ Board Game Premium", desc: "Dari Catan, Pandemic, Azul, hingga Dixit. Koleksi kami terus bertambah setiap bulan.", color: "#45A1FD", bg: "#EBF5FF" },
    { icon: Coffee, title: "Kopi & Snack Lezat", desc: "Menu spesial yang diformulasikan untuk menemani sesi game marathon kamu.", color: "#7C3AED", bg: "#F5F3FF" },
    { icon: Wifi, title: "Reservasi Digital", desc: "Scan QR, pilih meja, dan pesan menu langsung dari hape. No antri, no ribet.", color: "#0284C7", bg: "#E0F2FE" },
    { icon: Trophy, title: "Loyalty & Rewards", desc: "Kumpulkan poin setiap kunjungan. Tukar dengan free drink, game gratis, dan hadiah eksklusif.", color: "#D97706", bg: "#FFFBEB" },
    { icon: Shield, title: "Game Master Siap Bantu", desc: "Bingung aturan game? Game Master kami siap menjelaskan dan memastikan sesi kamu seru habis.", color: "#059669", bg: "#ECFDF5" },
    { icon: Heart, title: "Suasana Cozy & Aman", desc: "Interior hangat, pencahayaan nyaman, AC dingin. Cocok dari jam terbuka sampai tutup.", color: "#DC2626", bg: "#FEF2F2" },
  ];
  return (
    <section className="py-20 px-5" style={{ backgroundColor: "#FAFAF8" }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: "#EBF5FF", border: "1px solid #FED7AA" }}>
              <Zap size={13} style={{ color: "#45A1FD" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#45A1FD" }}>KENAPA SEBANGKU?</span>
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", color: "#1C1410", lineHeight: 1.15 }}>
              Lebih dari Sekadar<br />
              <span style={{ color: "#45A1FD" }}>Tempat Nongkrong</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: "#6B4436", marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>
              Kami merancang setiap detail agar kamu dan teman-teman punya experience terbaik.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.07}>
              <motion.div whileHover={{ translateY: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
                className="bg-white rounded-3xl p-6 cursor-default"
                style={{ border: "1.5px solid #F3F4F6", transition: "box-shadow 0.2s" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: f.bg }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "17px", color: "#1C1410", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B4436", lineHeight: 1.65 }}>{f.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MENU HIGHLIGHTS
// ─────────────────────────────────────────────────────────────────────────────

function MenuSection() {
  const navigate = useNavigate();
  const items = [
    { name: "Kopi Susu Aren", desc: "Espresso shot dengan susu segar & gula aren asli Jawa", price: 28_000, badge: "🔥 Bestseller", img: "https://images.unsplash.com/photo-1767439327066-36be4e6f0fe4?w=600&q=80" },
    { name: "Matcha Latte", desc: "Matcha ceremonial grade Jepang dengan oat milk pilihan", price: 32_000, badge: "🔥 Bestseller", img: "https://images.unsplash.com/photo-1634473115412-8fa5b647ef59?w=600&q=80" },
    { name: "Game Night Bundle", desc: "2 minuman + 1 snack + 1 dessert, hemat 20% untuk teman bermain", price: 89_000, badge: "✨ Baru", img: "https://images.unsplash.com/photo-1706295331319-8ec5da63cb91?w=600&q=80" },
    { name: "Tiramisu", desc: "Tiramisu klasik Italia, espresso & mascarpone ringan", price: 42_000, badge: "✨ Baru", img: "https://images.unsplash.com/photo-1593545024944-b3c74435b9f3?w=600&q=80" },
  ];

  return (
    <section id="menu" className="py-20 px-5" style={{ backgroundColor: "#1C1410" }}>
      <WaveDivider flip fill="#1C1410" />
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                style={{ backgroundColor: "rgba(69,161,253,0.15)", border: "1px solid rgba(69,161,253,0.3)" }}>
                <Coffee size={13} style={{ color: "#82C2FF" }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#82C2FF" }}>MENU UNGGULAN</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(26px,4vw,42px)", color: "white", lineHeight: 1.15 }}>
                Kopi & Snack<br />
                <span style={{ color: "#45A1FD" }}>Untuk Ngegame</span>
              </h2>
            </div>
            <button onClick={() => navigate("/scan")}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl cursor-pointer shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.14)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
            >
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", color: "white" }}>Lihat semua menu</span>
              <ArrowRight size={14} style={{ color: "#82C2FF" }} />
            </button>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <FadeUp key={item.name} delay={i * 0.08}>
              <motion.div whileHover={{ translateY: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.4)" }}
                className="rounded-3xl overflow-hidden cursor-pointer"
                style={{ backgroundColor: "#2A1E18", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="relative" style={{ paddingTop: "70%" }}>
                  <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,20,16,0.7) 0%, transparent 50%)" }} />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: "#EBF5FF", color: "#45A1FD" }}>
                    {item.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "15px", color: "white", marginBottom: 4 }}>{item.name}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 10 }}>{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "16px", color: "#82C2FF" }}>
                      Rp {item.price.toLocaleString("id")}
                    </span>
                    <button onClick={() => navigate("/scan")}
                      className="px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold"
                      style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: "#45A1FD", color: "white" }}>
                      Pesan
                    </button>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  BOARD GAMES
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
//  LOYALTY
// ─────────────────────────────────────────────────────────────────────────────

function LoyaltySection() {
  const navigate = useNavigate();
  const levels = [
    { name: "Bronze", color: "#CA8A04", bg: "#FFFBEB", border: "#FDE68A", emoji: "🥉", poin: "0–999", perks: "Poin 1× · Diskon 5%" },
    { name: "Silver", color: "#94A3B8", bg: "#F8FAFC", border: "#CBD5E1", emoji: "🥈", poin: "1K–4.9K", perks: "Poin 1.5× · Diskon 10%" },
    { name: "Gold", color: "#D97706", bg: "#FFFBEB", border: "#FCD34D", emoji: "🥇", poin: "5K–14.9K", perks: "Poin 2× · Diskon 15% · Priority" },
    { name: "Platinum", color: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD", emoji: "💎", poin: "15K+", perks: "Poin 3× · Diskon 20% · VIP Seat" },
  ];
  return (
    <section id="loyalty" className="py-20 px-5" style={{ backgroundColor: "#1C1410" }}>
      <WaveDivider flip fill="#1C1410" />
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: "rgba(69,161,253,0.15)", border: "1px solid rgba(69,161,253,0.3)" }}>
              <Trophy size={13} style={{ color: "#82C2FF" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#82C2FF" }}>PROGRAM LOYALTY</span>
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", color: "white", lineHeight: 1.15 }}>
              Makin Sering Main,<br />
              <span style={{ color: "#45A1FD" }}>Makin Banyak Reward!</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", marginTop: 12 }}>
              Kumpulkan poin dari setiap kunjungan dan pesanan. Naiki level untuk benefit eksklusif.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {levels.map((lv, i) => (
            <FadeUp key={lv.name} delay={i * 0.08}>
              <motion.div whileHover={{ translateY: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}
                className="rounded-3xl p-5 text-center cursor-default"
                style={{ backgroundColor: "#2A1E18", border: `1.5px solid ${lv.border}30` }}>
                <div className="text-4xl mb-3">{lv.emoji}</div>
                <span className="px-3 py-1 rounded-full text-xs font-bold block mb-2"
                  style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: lv.bg + "20", color: lv.color }}>{lv.name}</span>
                <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{lv.poin} poin</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{lv.perks}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center gap-5 p-6 rounded-3xl"
            style={{ backgroundColor: "rgba(69,161,253,0.12)", border: "1px solid rgba(69,161,253,0.25)" }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={18} style={{ color: "#82C2FF" }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 700, color: "#82C2FF" }}>BONUS SIGN UP</span>
              </div>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "20px", color: "white" }}>Daftar sekarang, dapat <span style={{ color: "#45A1FD" }}>200 poin gratis!</span></h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Langsung bisa ditukar dengan diskon atau minuman gratis.</p>
            </div>
            <button onClick={() => navigate("/register")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl cursor-pointer shrink-0"
              style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)", boxShadow: "0 6px 20px rgba(69,161,253,0.4)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "14px", color: "white" }}>Daftar Gratis</span>
              <ArrowRight size={15} style={{ color: "white" }} />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  LOKASI
// ─────────────────────────────────────────────────────────────────────────────

function LokasiSection() {
  const hours = [
    { day: "Senin – Kamis", time: "10.00 – 23.00" },
    { day: "Jumat", time: "10.00 – 24.00" },
    { day: "Sabtu – Minggu", time: "09.00 – 24.00" },
  ];
  return (
    <section id="lokasi" className="py-20 px-5" style={{ backgroundColor: "#FAFAF8" }}>
      <WaveDivider fill="#FAFAF8" />
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: "#EBF5FF", border: "1px solid #FED7AA" }}>
              <MapPin size={13} style={{ color: "#45A1FD" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#45A1FD" }}>LOKASI & JAM BUKA</span>
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", color: "#1C1410" }}>
              Temukan Kami <span style={{ color: "#45A1FD" }}>di Sini</span>
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map placeholder */}
          <FadeUp>
            <div className="rounded-3xl overflow-hidden" style={{ height: 320, backgroundColor: "#F0F0F0", border: "2px solid #F3F4F6", position: "relative" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)" }}>
                  <MapPin size={28} style={{ color: "white" }} />
                </div>
                <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "16px", color: "#1C1410" }}>Sebangku Board Game Cafe</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B4436", textAlign: "center", maxWidth: 240 }}>
                  Jl. Contoh Raya No. 1, Kota Kamu, Provinsi Contoh 12345
                </p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl"
                  style={{ backgroundColor: "#45A1FD", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 700, color: "white", textDecoration: "none" }}>
                  <MapPin size={12} /> Buka di Google Maps
                </a>
              </div>
            </div>
          </FadeUp>

          {/* Info */}
          <FadeUp delay={0.1}>
            <div className="flex flex-col gap-4">
              {/* Jam buka */}
              <div className="bg-white rounded-3xl p-6" style={{ border: "1.5px solid #F3F4F6" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} style={{ color: "#45A1FD" }} />
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "16px", color: "#1C1410" }}>Jam Operasional</span>
                </div>
                <div className="space-y-3">
                  {hours.map(h => (
                    <div key={h.day} className="flex items-center justify-between">
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B4436" }}>{h.day}</span>
                      <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "14px", color: "#1C1410" }}>{h.time}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #F3F4F6" }}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 700, color: "#059669" }}>Buka Sekarang</span>
                </div>
              </div>

              {/* Kontak */}
              <div className="bg-white rounded-3xl p-6" style={{ border: "1.5px solid #F3F4F6" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Phone size={18} style={{ color: "#45A1FD" }} />
                  <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "16px", color: "#1C1410" }}>Kontak</span>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Phone, label: "WhatsApp", val: "+62 812-3456-7890" },
                    { icon: Instagram, label: "Instagram", val: "@sebangku.id" },
                    { icon: Twitter, label: "Twitter", val: "@sebangku_id" },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#EBF5FF" }}>
                        <c.icon size={13} style={{ color: "#45A1FD" }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "#9CA3AF" }}>{c.label}</p>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#1C1410" }}>{c.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CTA FINAL
// ─────────────────────────────────────────────────────────────────────────────

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-5" style={{ backgroundColor: "#45A1FD" }}>
      <WaveDivider flip fill="#45A1FD" />
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <div className="text-6xl mb-6">🎲</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(30px,5vw,54px)", color: "white", lineHeight: 1.1, marginBottom: 16 }}>
            Siap Ngegame Hari Ini?
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: 40, lineHeight: 1.7 }}>
            Scan QR di meja, pilih game, pesan menu favorit. Semua dari hape kamu. Mudah dan cepat!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button whileHover={{ translateY: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/scan")}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl cursor-pointer"
              style={{ backgroundColor: "#1C1410" }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "15px", color: "white" }}>📱 Scan & Pesan Sekarang</span>
            </motion.button>
            <motion.button whileHover={{ translateY: -3 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.5)" }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "15px", color: "white" }}>Daftar Member</span>
              <ArrowRight size={16} style={{ color: "white" }} />
            </motion.button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-5 py-10" style={{ backgroundColor: "#1C1410" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)" }}>
            <Gamepad2 size={18} style={{ color: "white" }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "16px", color: "white" }}>Sebangku</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Board Game Cafe</p>
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          © 2026 Sebangku Board Game Cafe. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {[Instagram, Twitter, Phone].map((Icon, i) => (
            <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(69,161,253,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}>
              <Icon size={15} style={{ color: "rgba(255,255,255,0.6)" }} />
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <LandingNavbar />
      <LandingHeroSection />
      <StatsSection />
      <WhySection />
      <CoffeeMenu />
      <DessertMenu />
      <GameLibrary />
      <LoyaltySection />
      <LokasiSection />
      <CTASection />
      <Footer />
    </div>
  );
}

