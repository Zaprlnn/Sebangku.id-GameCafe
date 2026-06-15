import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, ArrowRight, Gamepad2, Users,
  Star, Instagram, Twitter,
  Menu, X, Sparkles, Zap, Smile, MessageCircle, MapPin, Phone, Mail,
  Utensils, Handshake, Lightbulb, Youtube, Clock
} from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

// ─── Shared Components ───────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 1.11, 0.81, 0.99] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 px-6 ${scrolled ? "py-4 bg-[#0D0D1A]/90 backdrop-blur-xl shadow-2xl" : "py-8 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <img
            src={sebangkuLogo}
            alt="Sebangku Game Cafe"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className={`font-extrabold text-xl leading-none tracking-tight transition-colors ${scrolled ? 'text-white' : 'text-[#1C1410]'}`}>
              Cafe.<span className="text-[#3B82F6]">sebangku.id</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="hidden lg:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="bg-[#3B82F6] text-white px-8 py-3 rounded-xl font-black text-sm shadow-xl shadow-[#3B82F6]/20 cursor-pointer"
          >
            RESERVASI / MASUK
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden p-2 transition-colors ${scrolled ? 'text-white' : 'text-[#1C1410]'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-black/5 overflow-hidden mt-4 rounded-2xl shadow-2xl"
          >
            <div className="flex flex-col p-6 gap-4">
              <button
                onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                className="bg-[#3B82F6] text-white py-4 rounded-xl font-black mt-2 shadow-lg shadow-[#3B82F6]/20 cursor-pointer"
              >
                RESERVASI / MASUK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────

function HeroSection() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1663100219417-eabaefc03fcb?w=1200&auto=format&fit=crop&q=80",
    "https://plus.unsplash.com/premium_photo-1664301485771-f8896c87af2c?w=1200&auto=format&fit=crop&q=80",
    "https://media.istockphoto.com/id/2235135467/photo/homemade-japanese-taiyaki-dessert.webp?a=1&b=1&s=612x612&w=0&k=20&c=H-z1PXA_Y8qK1y31OLmX2liFNmcUJalSontMI4PLTRE="
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Glows (Subtle for white bg) */}
      <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <FadeUp>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-[#3B82F6] font-bold text-xs tracking-widest uppercase">
              First Edugame Cafe di Indonesia
            </div>
            <h1 className="font-['Poppins'] text-5xl md:text-6xl font-extrabold text-[#1C1410] leading-[1.1] " >
              Main Game Seru, <br />
              <span className="text-[#3B82F6] italic">Bonding Makin</span> <br />
              Bermakna!
            </h1>
            <p className="text-[#64748B] text-lg md:text-xl leading-relaxed max-w-lg font-medium">
              Kombinasi koleksi board game lengkap, kuliner lezat, dan suasana hangat untuk momen tak terlupakan bersama teman & keluarga.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-[#3B82F6] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-[#3B82F6]/30 flex items-center gap-3 group cursor-pointer transition-all"
              >
                RESERVASI SEKARANG <ArrowRight size={22} />
              </motion.button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-black/5">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-[#1C1410]">50+</span>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-widest mt-1">Koleksi Game</span>
              </div>
              <div className="flex flex-col border-l border-black/5 pl-8">
                <span className="text-4xl font-black text-[#1C1410]">6</span>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-widest mt-1">Rasa Taiyaki</span>
              </div>
              <div className="flex flex-col border-l border-black/5 pl-8">
                <span className="text-4xl font-black text-[#1C1410]">1K+</span>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-widest mt-1">Pelanggan Senang</span>
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="relative p-10"> {/* Padding to accommodate pop-out elements */}
            {/* Main Image Container */}
            <div className="relative rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
              <div className="rounded-[48px] overflow-hidden bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt="Sebangku Experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-full h-[430px] object-cover"
                  />
                </AnimatePresence>
              </div>

              {/* Top Right Rating Badge - Popping out */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="absolute -top-6 -right-6 bg-[#3B82F6] text-white p-8 rounded-[32px] shadow-[0_24px_48px_-12px_rgba(59,130,246,0.4)] text-center min-w-[160px] z-20"
              >
                <div className="text-4xl font-black mb-1">4.9</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="white" className="text-white" />)}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Rating</div>
              </motion.div>

              {/* Bottom Left Review Card - Popping out */}
              <motion.div
                initial={{ opacity: 0, x: -50, y: 50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="absolute -bottom-8 -left-3 bg-white p-5 rounded-[20px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-black/5 h-[190px] w-[330px] z-20"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#3B82F6]/20 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80"
                      alt="Mas Bagus"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-[#1C1410] text-xl">Mas Bagus</h4>
                    <p className="text-sm font-bold text-[#64748B]">Mahasiswa UNY</p>
                  </div>
                </div>
                <div className="flex text-[#3B82F6] gap-1.5 mb-4">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-[#1C1410] font-medium leading-relaxed italic text-lg">
                  "Spot nongkrong paling seru dan edukatif!"
                </p>
              </motion.div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Marquee Ticker ──────────────────────────────────────────────────────────

function MarqueeTicker() {
  const items = [
    { text: "Board Game Seru", icon: "🎲" },
    { text: "Taiyaki Fresh", icon: "🐟" },
    { text: "50+ Koleksi", icon: "🎯" },
    { text: "Bonding Time", icon: "❤️" },
    { text: "Puzzle Edukatif", icon: "🧩" },
    { text: "Rated 4.9/5", icon: "⭐" },
  ];

  return (
    <div className="py-5 bg-[#3B82F6] overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center px-10">
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="text-white font-bold text-lg md:text-xl tracking-tight">
              {item.text}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ─── Problem Statement ──────────────────────────────────────────────────────

const PROBLEM_CARDS = [
  {
    badge: "Board Game",
    label: "Sibuk Gadget !",
    desc: "Nongkrong tapi sibuk masing-masing dengan HP? Membosankan!",
    image: "https://images.unsplash.com/photo-1679539143915-947178dbea00?w=1200&auto=format&fit=crop&q=80",
  },
  {
    badge: "Edukasi",
    label: "Bingung Hiburan",
    desc: "Mau main tapi capek yang itu-itu saja? Butuh variasi baru!",
    image: "https://images.unsplash.com/photo-1719494206741-79831f9f4d51?w=1200&auto=format&fit=crop&q=80",
  },
  {
    badge: "Experience",
    label: "Kurang Bonding",
    desc: "Ingin aktivitas yang benar-benar mendekatkan hubungan?",
    image: "https://images.unsplash.com/photo-1577897113292-3b95936e5206?w=1200&auto=format&fit=crop&q=80",
  },
];

function ProblemSection() {
  return (
    <section className="py-24 bg-[#EFF6FF]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-black text-[#0D0D1A] mb-4 leading-tight">
              Lupakan Nongkrong <span className="text-[#3B82F6]">Biasa</span>
            </h2>
            <p className="text-sm font-bold text-[#0D0D1A]/60 uppercase tracking-[0.2em] max-w-xl mx-auto text-center">
              Sering merasa bosan saat berkumpul?<br />
              Kami hadir untuk mengubah cara kamu bersosialisasi.
            </p>
          </FadeUp>
        </div>

        {/* Photo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEM_CARDS.map((card, i) => (
            <FadeUp key={i} delay={i * 0.12}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                {/* Background photo */}
                <img
                  src={card.image}
                  alt={card.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A]/80 via-[#0D0D1A]/30 to-transparent" />

                {/* Badge — top right */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-white text-[#3B82F6] text-xs font-bold px-3 py-1 rounded-full shadow">
                    {card.badge}
                  </span>
                </div>

                {/* Text — bottom left */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 text-left">
                  <h3 className="text-white font-black text-xl mb-1 leading-tight">{card.label}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Why Choose Us ──────────────────────────────────────────────────────────

function WhyChooseUs() {
  const benefits = [
    {
      image: "https://images.unsplash.com/photo-1611891487122-207579d67d98?w=800&auto=format&fit=crop&q=80",
      title: "Koleksi Game Edukatif Terlengkap",
      desc: "Ratusan board game & digital game yang mengasah otak."
    },
    {
      image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&auto=format&fit=crop&q=80",
      title: "Kuliner Menggugah Selera",
      desc: "Pilihan makanan dan minuman lezat pendamping main."
    },
    {
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
      title: "Social Bonding",
      desc: "Ciptakan momen berkualitas dan kedekatan yang nyata."
    },
    {
      image: "https://images.unsplash.com/photo-1673260984699-44b403381769?w=800&auto=format&fit=crop&q=80",
      title: "Edukatif & Menyenangkan",
      desc: "Game dipilih untuk melatih strategi, kreativitas & teamwork"
    },
  ];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Side: Image + Floating Stats */}
        <FadeUp>
          <div className="relative pb-16 lg:pb-0">
            <img
              src="https://images.unsplash.com/photo-1577896849786-738ed6c78bd3?w=1200&auto=format&fit=crop&q=80"
              alt="Sebangku Experience"
              className="rounded-[40px] shadow-2xl w-full aspect-[4/5] lg:aspect-square object-cover"
            />

            {/* Floating Stats Card (2x2 Grid like screenshot) */}
            <div className="absolute bottom-0 right-0 lg:-right-10 bg-white p-8 rounded-[32px] shadow-2xl border border-blue-50 min-w-[280px] transform translate-y-8 lg:translate-y-12">
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <p className="text-[#3B82F6] font-black text-2xl leading-none">50+</p>
                  <p className="text-[#1C1410]/40 text-[10px] font-bold uppercase mt-1.5 tracking-wider">Games</p>
                </div>
                <div>
                  <p className="text-[#3B82F6] font-black text-2xl leading-none">6 Rasa</p>
                  <p className="text-[#1C1410]/40 text-[10px] font-bold uppercase mt-1.5 tracking-wider">Taiyaki</p>
                </div>
                <div>
                  <p className="text-[#3B82F6] font-black text-2xl leading-none">1000+</p>
                  <p className="text-[#1C1410]/40 text-[10px] font-bold uppercase mt-1.5 tracking-wider">Pelanggan</p>
                </div>
                <div>
                  <p className="text-[#3B82F6] font-black text-2xl leading-none">4.9★</p>
                  <p className="text-[#1C1410]/40 text-[10px] font-bold uppercase mt-1.5 tracking-wider">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Right Side: Content */}
        <div className="pt-20 lg:pt-0">
          <FadeUp>
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-[#F4C430] fill-[#F4C430]" />
              <span className="text-[10px] font-black tracking-[0.2em] text-[#3B82F6] uppercase">Keunggulan Kami</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0D0D1A] mb-6 leading-tight">
              Mengapa Pilih <br />
              <span className="text-[#3B82F6] italic">cafe.sebangku?</span>
            </h2>
            <p className="text-[#1C1410]/60 text-base leading-relaxed mb-10 max-w-lg">
              Kami hadir sebagai destinasi edukatif pertama di Indonesia yang memadukan keseruan bermain, kelezatan kuliner, dan kehangatan kebersamaan dalam satu meja.
            </p>
          </FadeUp>

          {/* Benefits List in white cards */}
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-5 hover:shadow-md transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0D0D1A] text-lg mb-1">{b.title}</h4>
                    <p className="text-[#64748B] text-sm font-medium leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────────

function TestimonialsSection() {
  const reviews = [
    { name: "Mas Bagus", avatar: "1", text: "Tempat favorit kalau mau ngumpul bareng tim. Board game-nya banyak yang baru!", role: "Student" },
    { name: "Bu Retno", avatar: "2", text: "Anak-anak suka sekali main game edukasi di sini. Makanannya juga ramah anak.", role: "Parent" },
    { name: "Pak Dwi", avatar: "3", text: "Suasananya tenang dan nyaman. Cocok buat brainstorming sambil main ringan.", role: "Professional" },
    { name: "Mbak Sekar", avatar: "4", text: "Service-nya top, diajarin main game dari nol sampai bisa. Seru banget!", role: "Content Creator" },
  ];

  return (
    <section className="py-32 bg-[#071E35] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <FadeUp>
            <h2 className="font-['Poppins'] text-4xl md:text-6xl font-extrabold text-white">
              Apa Kata <span className="text-[#3B82F6] italic">Mereka?</span>
            </h2>
            <p className="text-[#C0C0D0] mt-4 font-bold uppercase tracking-[0.3em] text-sm">
              1,000+ Kepuasan Sejak 2023
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="bg-white px-8 py-4 rounded-2xl border border-black/5 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-black font-black text-xl">1.000+ Datang</div>
            </div>
          </FadeUp>
        </div>

        <div className="relative mt-10">
          <div className="flex animate-marquee-slow">
            {[...reviews, ...reviews, ...reviews].map((r, i) => (
              <div key={i} className="min-w-[280px] max-w-[280px] px-3">
                <div className="bg-white p-6 rounded-[24px] border border-black/5 hover:border-[#3B82F6]/30 transition-all flex flex-col h-[380px] shadow-2xl relative group/card">
                  <div className="flex text-[#F4C430] mb-6">
                    {[1, 2, 3, 4, 5].map(j => <Star key={j} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-black/80 font-['Poppins'] italic leading-relaxed mb-6 text-sm line-clamp-6">"{r.text}"</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-black/5 mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-[#F4C430]/20">
                      <img src={`https://i.pravatar.cc/100?u=${r.name}`} alt={r.name} />
                    </div>
                    <div>
                      <h4 className="font-['Poppins'] font-bold text-black text-sm">{r.name}</h4>
                      <p className="text-[10px] font-['Poppins'] font-bold text-black/50 uppercase tracking-widest">{r.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes marquee-slow {
              0% { transform: translateX(-33.33%); }
              100% { transform: translateX(0); }
            }
            .animate-marquee-slow {
              display: flex;
              animation: marquee-slow 60s linear infinite;
              width: max-content;
            }
            .animate-marquee-slow:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ───────────────────────────────────────────────────────────

function HowItWorks() {
  const navigate = useNavigate();
  const steps = [
    {
      id: "01",
      title: "Pilih Paket / Meja",
      desc: "Datang langsung atau reservasi online melalui WhatsApp. Tim kami siap menyambut dan mengarahkan Anda ke meja terbaik.",
      image: "https://images.unsplash.com/photo-1698188667999-753bc61fcca4?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: "02",
      title: "Pilih Permainan",
      desc: "Jelajahi 50+ koleksi boardgame kami. Game master kami yang ramah siap membantu menjelaskan cara main dari awal hingga siap.",
      image: "https://images.unsplash.com/photo-1673260984699-44b403381769?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: "03",
      title: "Nikmati Momen",
      desc: "Main sepuasnya sambil menikmati taiyaki fresh dan minuman segar. Waktu berkualitas tak terlupakan bersama orang-orang tersayang.",
      image: "https://images.unsplash.com/photo-1676562330796-593b68d44e20?w=1000&auto=format&fit=crop&q=80"
    },
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <FadeUp>
            <span className="text-[#3B82F6] font-black uppercase tracking-[0.4em] text-xs mb-4 block text-center">Cara Penggunaan</span>
            <h2 className="font-['Poppins'] text-4xl md:text-6xl font-extrabold text-[#1C1410] mb-6 text-center">
              How It <span className="text-[#3B82F6] italic">Works</span>
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto font-medium text-center">
              Hanya 3 langkah mudah untuk memulai pengalaman terbaik di cafe.sebangku.id
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((step, i) => (
            <FadeUp key={step.id} delay={i * 0.2}>
              <div className="bg-white p-8 rounded-[40px] border border-[#3B82F6]/5 shadow-2xl shadow-[#3B82F6]/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500 h-full">
                <div className="relative mb-10">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#3B82F6]/10 p-1">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-black border-4 border-white shadow-lg">
                    {parseInt(step.id)}
                  </div>
                  <div className="absolute top-1/2 -right-24 -translate-y-1/2 bg-[#3B82F6]/5 px-4 py-2 rounded-lg border border-[#3B82F6]/10 hidden lg:block">
                    <span className="text-[#3B82F6] text-[10px] font-black uppercase tracking-widest">Langkah {step.id}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-['Poppins'] font-extrabold text-[#1C1410] mb-4">
                  {step.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* CTA Banner */}
        <FadeUp delay={0.4}>
          <div className="bg-[#3B82F6] rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-[#3B82F6]/30">
            <div className="text-center md:text-left">
              <h3 className="text-white text-2xl md:text-3xl font-['Poppins'] font-extrabold mb-2">
                Siap memulai? Reservasi sekarang!
              </h3>
              <p className="text-white/80 font-medium">
                Meja tersedia setiap senin - jumat, pukul 10.00 - 18.00 WIB
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="bg-white text-[#3B82F6] px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 cursor-pointer"
            >
              Reservasi Sekarang <ArrowRight size={20} />
            </motion.button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────

function FAQSection() {
  const faqs = [
    { q: "Apakah saya harus bisa bermain board game sebelum datang ke sini?", a: "Tidak perlu khawatir! Game master kami yang ramah akan membantu menjelaskan aturan main dari koleksi lengkap kami agar Anda bisa langsung bersenang-senang dari momen pertama." },
    { q: "Apakah ada batasan usia untuk pengunjung?", a: "Kami terbuka untuk semua kalangan usia. Koleksi kami mencakup game yang cocok untuk anak-anak, remaja, hingga dewasa." },
    { q: "Apakah koleksi permainannya hanya berupa board game fisik?", a: "Ya, kami berfokus pada pengalaman interaksi langsung melalui koleksi board game fisik pilihan dari seluruh dunia." },
    { q: "Bolehkah saya datang hanya untuk mengerjakan tugas tanpa bermain game?", a: "Tentu saja! Sebangku menyediakan suasana yang nyaman untuk bekerja atau belajar sambil menikmati sajian cafe kami." },
    { q: "Bagaimana cara melakukan reservasi untuk acara keluarga atau grup besar?", a: "Untuk grup besar atau acara khusus, kami menyarankan reservasi terlebih dahulu melalui WhatsApp untuk memastikan ketersediaan tempat." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left Info Column */}
        <div className="lg:col-span-4">
          <FadeUp>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-red-500 font-black text-2xl">?</span>
              <span className="text-[#3B82F6] font-black uppercase tracking-widest text-sm">FAQ</span>
            </div>
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-black text-[#1C1410] mb-8 leading-tight">
              Pertanyaan <br /><span className="text-[#3B82F6] italic">Umum</span>
            </h2>
            <p className="text-[#64748B] font-medium mb-10 leading-relaxed">
              Tidak menemukan jawaban yang kamu cari? Hubungi kami langsung via WhatsApp.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-[#3B82F6]/20 text-[#3B82F6] font-black hover:bg-[#3B82F6]/5 transition-all mb-12"
            >
              <MessageCircle size={20} />
              Chat WhatsApp
            </motion.button>

            <div className="bg-[#3B82F6]/5 p-8 rounded-3xl border border-[#3B82F6]/10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-[#3B82F6] font-black mb-4">
                  <Clock size={20} />
                  Jam Operasional
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[#64748B] font-bold">Senin – Jumat</span>
                  <span className="text-[#1C1410] font-black">10.00 – 18.00 WIB</span>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Right Accordion Column */}
        <div className="lg:col-span-8 space-y-4">
          {faqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div
                className={`group cursor-pointer rounded-[24px] transition-all duration-500 border-2 ${openIndex === i ? 'bg-white border-[#3B82F6] shadow-xl shadow-[#3B82F6]/5' : 'bg-white border-black/5 hover:border-[#3B82F6]/30'
                  }`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-6">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm transition-colors ${openIndex === i ? 'bg-[#3B82F6] text-white' : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                      }`}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className={`flex-1 font-['Poppins'] font-bold text-lg md:text-xl transition-colors ${openIndex === i ? 'text-[#1C1410]' : 'text-[#1C1410]/80 group-hover:text-[#3B82F6]'
                      }`}>
                      {faq.q}
                    </h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === i ? 'bg-[#3B82F6] text-white rotate-180' : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                      }`}>
                      <ChevronDown size={18} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-black/5">
                          <div className="w-8 h-1 bg-[#3B82F6]/30 rounded-full mb-6" />
                          <p className="text-[#64748B] font-medium leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA Section ───────────────────────────────────────────────────────

function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto bg-[#F0F7FF] rounded-[48px] p-12 md:p-20 relative overflow-hidden border border-[#3B82F6]/10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="lg:col-span-7 max-w-2xl text-center lg:text-left">
            <FadeUp>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <span className="text-[#3B82F6] font-black uppercase tracking-widest text-xs">Reservasi Sekarang</span>
              </div>
              <h2 className="font-['Poppins'] text-4xl md:text-6xl font-black text-[#1C1410] mb-8 leading-tight">
                Siap untuk <br />
                <span className="text-[#3B82F6] italic">Pengalaman Berbeda?</span>
              </h2>
              <p className="text-[#64748B] text-lg font-medium leading-relaxed">
                Reservasi meja sekarang dan nikmati sesi bermain seru bersama orang-orang terkasih. Tersedia untuk grup keluarga, komunitas & corporate outing.
              </p>
            </FadeUp>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-8">
            <FadeUp delay={0.2}>
              <div className="flex flex-col items-center lg:items-start gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="bg-[#3B82F6] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#3B82F6]/30 flex items-center gap-3 cursor-pointer"
                >
                  RESERVASI TEMPAT SEKARANG
                </motion.button>
                <button className="text-[#3B82F6] font-black flex items-center gap-2 hover:gap-4 transition-all">
                  Lihat Menu Taiyaki <ArrowRight size={18} />
                </button>
              </div>

              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((id, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-[#3B82F6]">
                      <img src={`https://i.pravatar.cc/100?u=${id}`} alt="Pelanggan" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-[#64748B] font-bold text-sm">1,000+ pelanggan puas</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#071E35] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          {/* Logo & Slogan Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <img src={sebangkuLogo} alt="Sebangku Logo" className="h-20 w-auto object-contain" />
              <h3 className="font-['Poppins'] font-black text-2xl text-white tracking-tight">
                Cafe.<span className="text-[#3B82F6]">Sebangku.id</span>
              </h3>
            </div>
            <p className="text-white/80 text-xl italic leading-relaxed max-w-sm font-medium">
              First edugame cafe di Indonesia. Bermain seru, kenyang & bonding bersama.
            </p>
          </div>

          {/* Info Cafe Column */}
          <div>
            <h4 className="font-['Poppins'] font-black text-white text-lg mb-10 tracking-[0.1em] uppercase">Info Cafe</h4>
            <ul className="space-y-5 font-bold text-white/90">
              {[
                { name: 'The Problem', href: '#problem' },
                { name: 'Cara Reservasi', href: '#reservasi' },
                { name: 'Testimonies', href: '#testimonies' },
                { name: 'How It Works', href: '#how-it-works' },
                { name: 'FAQ', href: '#faq' }
              ].map((link) => (
                <li key={link.name} className="flex items-center gap-3 group cursor-pointer">
                  <span className="text-white/40 group-hover:text-[#3B82F6] transition-colors">•</span>
                  <a href={link.href} className="group-hover:text-[#3B82F6] transition-colors text-lg font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hubungi Kami Column */}
          <div>
            <h4 className="font-['Poppins'] font-black text-white text-lg mb-10 tracking-[0.1em] uppercase">Hubungi Kami</h4>
            <ul className="space-y-8">
              <li className="flex items-center gap-5 group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-all duration-300">
                  <Mail size={20} className="text-[#3B82F6]" />
                </div>
                <span className="text-white/90 text-lg font-medium italic group-hover:text-[#3B82F6] transition-colors">
                  Sebangkukuliner@gmail.com
                </span>
              </li>
              <li className="flex items-center gap-5 group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-all duration-300">
                  <MapPin size={20} className="text-[#3B82F6]" />
                </div>
                <span className="text-white/90 text-lg font-medium italic group-hover:text-[#3B82F6] transition-colors">
                  Yogyakarta, DIY
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/40 text-sm font-bold tracking-wide">
            © 2025 cafe.sebangku.id · All rights reserved
          </p>
          <div className="flex gap-10 text-sm font-bold text-white/40">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] bg-[#0D0D1A] text-white selection:bg-[#3B82F6]/30">
      <Navbar />
      <HeroSection />
      <MarqueeTicker />
      <ProblemSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <HowItWorks />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
