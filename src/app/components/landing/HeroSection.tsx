import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronRight } from "lucide-react";

const FLOATING_ITEMS = ["🎲", "♟️", "🃏", "🎯", "🧩", "🎮"];

// ─────────────────────────────────────────────────────────────────────────────
//  WAVE DIVIDER
// ─────────────────────────────────────────────────────────────────────────────

function WaveBottom() {
  return (
    <div style={{ lineHeight: 0, marginTop: -2 }}>
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 72 }}
      >
        <path
          d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
          fill="#45A1FD"
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  STATS DATA
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "50+", label: "Koleksi Game" },
  { value: "20+", label: "Varian Kopi" },
  { value: "5K+", label: "Member Aktif" },
  { value: "5.0 ★", label: "Rating Google" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  PHOTO SOURCES
// ─────────────────────────────────────────────────────────────────────────────

const PHOTO_LARGE = "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=900&q=80";
const PHOTO_LEFT = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80";
const PHOTO_RIGHT = "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&q=80";

// ─────────────────────────────────────────────────────────────────────────────
//  HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ backgroundColor: "#1C1410", paddingTop: 64 }}
    >
      {/* ── Floating decorative emojis (from original hero) ── */}
      {FLOATING_ITEMS.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl select-none pointer-events-none z-0"
          style={{
            top: `${10 + (i * 14) % 75}%`,
            left: i % 2 === 0 ? `${3 + i * 2}%` : undefined,
            right: i % 2 !== 0 ? `${3 + i * 2}%` : undefined,
            opacity: 0.15,
          }}
          animate={{ y: [0, -20, 0], rotate: [0, 8, -8, 0] }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* ── Radial glow orb ── */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(69,161,253,0.16) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Main content ── */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ════════════ LEFT — Text Content ════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >

              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full"
                style={{
                  backgroundColor: "rgba(69,161,253,0.15)",
                  border: "1.5px solid rgba(69,161,253,0.5)",
                }}>
                <span
                  className="w-2 h-2 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: "#22C55E" }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    color: "#82C2FF",
                    letterSpacing: "0.02em",
                  }}
                >
                  BUKA HARI INI · 11.00 – 22.00 WIB
                </span>
              </div>

              {/* Headline */}
              <h1
                className="leading-tight"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 900,
                  fontSize: "clamp(40px, 5.5vw, 64px)",
                  lineHeight: 1.08,
                }}
              >
                <span style={{ color: "white" }}>Main Game,</span>
                <br />
                <span style={{ color: "#45A1FD" }}>Minum Kopi,</span>
                <br />
                <span style={{ color: "white" }}>Bahagia!</span>
              </h1>

              {/* Subheadline */}
              <p
                className="max-w-lg"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.75,
                }}
              >
                Cafe board game dengan{" "}
                <strong style={{ color: "white" }}>500+ koleksi game</strong>,
                Game Master siap bantu, kopi premium berbagai varian,
                dan dessert yang menggoda.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ translateY: -3, boxShadow: "0 14px 32px rgba(69,161,253,0.45)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/scan")}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full cursor-pointer shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
                    border: "none",
                    boxShadow: "0 6px 20px rgba(69,161,253,0.35)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: "15px",
                      color: "white",
                    }}
                  >
                    🎲 Reservasi Meja
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ translateY: -3, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full cursor-pointer shrink-0"
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid rgba(255,255,255,0.4)",
                    transition: "background-color 200ms ease, border-color 200ms ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "white",
                    }}
                  >
                    Lihat Koleksi Game
                  </span>
                  <ChevronRight size={16} style={{ color: "white" }} />
                </motion.button>
              </div>

              {/* Stats row */}
              <div
                className="grid grid-cols-4 gap-4 mt-2 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
              >
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
                    className="flex flex-col gap-0.5"
                  >
                    <span
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 900,
                        fontSize: "clamp(18px, 2.2vw, 26px)",
                        color: "#45A1FD",
                        lineHeight: 1.1,
                      }}
                    >
                      {s.value.includes("★") ? (
                        <>
                          {s.value.replace("★", "")}
                          <Star
                            size={14}
                            fill="#F59E0B"
                            style={{ color: "#F59E0B", display: "inline", marginLeft: 1 }}
                          />
                        </>
                      ) : (
                        s.value
                      )}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.3,
                      }}
                    >
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ════════════ RIGHT — Bento Photo Grid ════════════ */}
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
              style={{ gap: 12, height: "clamp(420px, 55vw, 560px)" }}
            >
              {/* ── Large top photo (60% height) ── */}
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ flex: "0 0 60%" }}
              >
                <img
                  src={PHOTO_LARGE}
                  alt="Interior Sebangku Board Game Cafe"
                  className="w-full h-full object-cover"
                  loading="eager"
                  style={{ transition: "transform 0.5s ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(28,20,16,0.55) 0%, transparent 55%)",
                  }}
                />
                {/* Floating badge bottom-left */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                  style={{
                    backgroundColor: "#45A1FD",
                    boxShadow: "0 4px 16px rgba(69,161,253,0.45)",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>🎮</span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "12px",
                      color: "white",
                    }}
                  >
                    Game Master Tersedia
                  </span>
                </motion.div>
              </div>

              {/* ── Two bottom photos (40% height) ── */}
              <div className="flex gap-3" style={{ flex: "0 0 40%" }}>

                {/* Bottom-left: people playing */}
                <div className="relative overflow-hidden rounded-2xl flex-1">
                  <img
                    src={PHOTO_LEFT}
                    alt="Seru main board game bersama di Sebangku"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    style={{ transition: "transform 0.5s ease" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(28,20,16,0.65) 0%, transparent 50%)",
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="absolute bottom-3 left-3"
                  >
                    <span
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "white",
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      Seru Bareng 🎲
                    </span>
                  </motion.div>
                </div>

                {/* Bottom-right: game pieces */}
                <div className="relative overflow-hidden rounded-2xl flex-1">
                  <img
                    src={PHOTO_RIGHT}
                    alt="Koleksi 500+ board game di Sebangku"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    style={{ transition: "transform 0.5s ease" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(28,20,16,0.6) 0%, transparent 55%)",
                    }}
                  />
                  {/* Badge overlay */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl"
                    style={{
                      backgroundColor: "rgba(69,161,253,0.9)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 800,
                        fontSize: "13px",
                        color: "white",
                      }}
                    >
                      500+ Game 🎲
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Wave divider ── */}
      <WaveBottom />
    </section>
  );
}

