import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
//  NAV LINKS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Koleksi Game",    href: "#games"   },
  { label: "Kopi & Minuman",  href: "#menu"    },
  { label: "Dessert",         href: "#menu"    },
  { label: "Event",           href: "#loyalty" },
  { label: "Lokasi",          href: "#lokasi"  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SMOOTH SCROLL HELPER
// ─────────────────────────────────────────────────────────────────────────────

function scrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  NAVBAR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [hoveredLink, setHoveredLink]   = useState<string | null>(null);

  // ── Detect scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", handler, { passive: true });
    handler(); // run once on mount
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Close mobile menu on resize ───────────────────────────────────────────
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── Lock body scroll when mobile menu open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ════════════════════════════ MAIN NAVBAR ════════════════════════════ */}
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: 64,
          backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
          transition: "background-color 300ms ease, backdrop-filter 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
        }}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 lg:px-10">

          {/* ── LOGO ── */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.08 }}
              transition={{ duration: 0.45 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl select-none"
              style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)", boxShadow: "0 4px 14px rgba(69,161,253,0.4)" }}
            >
              🎲
            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 900,
                  fontSize: "19px",
                  color: scrolled ? "#1C1410" : "white",
                  lineHeight: 1.1,
                  transition: "color 300ms ease",
                }}
              >
                Sebangku
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "8px",
                  letterSpacing: "0.18em",
                  color: scrolled ? "#45A1FD" : "rgba(130,194,255,0.9)",
                  transition: "color 300ms ease",
                }}
              >
                BOARD GAME CAFE
              </span>
            </div>
          </button>

          {/* ── DESKTOP NAV LINKS ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isHovered = hoveredLink === link.label;
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-4 py-2 rounded-xl cursor-pointer"
                  style={{ background: "none", border: "none" }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: isHovered
                        ? "#45A1FD"
                        : scrolled
                        ? "#6B4436"
                        : "rgba(255,255,255,0.82)",
                      transition: "color 200ms ease",
                    }}
                  >
                    {link.label}
                  </span>
                  {/* Underline indicator */}
                  <motion.div
                    animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full origin-left"
                    style={{ backgroundColor: "#45A1FD" }}
                  />
                </button>
              );
            })}
          </nav>

          {/* ── CTA BUTTON ── */}
          <div className="hidden md:flex">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/scan")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full cursor-pointer"
              style={{
                background: "#45A1FD",
                boxShadow: "0 4px 16px rgba(69,161,253,0.38)",
                border: "none",
                transition: "background 200ms ease, box-shadow 200ms ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#82C2FF";
                e.currentTarget.style.boxShadow = "0 6px 22px rgba(130,194,255,0.5)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#45A1FD";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(69,161,253,0.38)";
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "white",
                  whiteSpace: "nowrap",
                }}
              >
                Reservasi Sekarang
              </span>
              <ArrowRight size={14} style={{ color: "white" }} />
            </motion.button>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer"
            style={{
              backgroundColor: scrolled ? "#F9FAFB" : "rgba(255,255,255,0.12)",
              border: scrolled ? "1px solid #E5E7EB" : "1px solid rgba(255,255,255,0.2)",
              transition: "background-color 300ms ease",
            }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X size={18} style={{ color: scrolled ? "#1C1410" : "white" }} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu size={18} style={{ color: scrolled ? "#1C1410" : "white" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* ════════════════════════════ MOBILE MENU ════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{ backgroundColor: "rgba(28,20,16,0.45)", backdropFilter: "blur(4px)" }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-down panel */}
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="fixed top-16 left-0 right-0 z-40"
              style={{
                backgroundColor: "white",
                borderBottom: "1px solid #F3F4F6",
                boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
              }}
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055 }}
                    onClick={() => {
                      setMobileOpen(false);
                      setTimeout(() => scrollTo(link.href), 200);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer text-left"
                    style={{
                      background: "none",
                      border: "none",
                      backgroundColor: "transparent",
                      transition: "background-color 150ms ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EBF5FF")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "15px",
                        color: "#1C1410",
                      }}
                    >
                      {link.label}
                    </span>
                    <ArrowRight size={15} style={{ color: "#45A1FD" }} />
                  </motion.button>
                ))}

                {/* Divider */}
                <div className="my-2 h-px" style={{ backgroundColor: "#F3F4F6" }} />

                {/* Mobile CTA */}
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.055 + 0.05 }}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/scan");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg,#45A1FD,#82C2FF)",
                    border: "none",
                    boxShadow: "0 6px 20px rgba(69,161,253,0.4)",
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
                    🎲 Reservasi Sekarang
                  </span>
                  <ArrowRight size={16} style={{ color: "white" }} />
                </motion.button>

                <p
                  className="text-center pb-1 pt-2"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    color: "#9CA3AF",
                  }}
                >
                  Scan QR di meja atau daftar dulu untuk mulai
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

