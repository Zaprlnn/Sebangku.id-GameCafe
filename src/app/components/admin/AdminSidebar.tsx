import { useNavigate, Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard, Armchair, ShoppingCart, ClipboardList,
  Dices, Users, Trophy, CalendarDays, TrendingUp, Settings2,
  LogOut, X, Shield,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminSession {
  name: string;
  role: string;
  email: string;
  loginAt: number;
}

// ─── Nav structure ────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    title: null,
    items: [
      { path: "/admin/dashboard", label: "Dashboard",   icon: LayoutDashboard, badge: null },
    ],
  },
  {
    title: "Operasional",
    items: [
      { path: "/admin/tables",   label: "Meja & Sesi", icon: Armchair,        badge: null },
      { path: "/admin/orders",   label: "Pesanan",     icon: ShoppingCart,    badge: "8"  },
      { path: "/admin/menu",     label: "Menu",        icon: ClipboardList,   badge: null },
      { path: "/admin/games",    label: "Game",        icon: Dices,           badge: null },
    ],
  },
  {
    title: "Member & Program",
    items: [
      { path: "/admin/members",  label: "Member",      icon: Users,           badge: null },
      { path: "/admin/loyalty",  label: "Loyalty",     icon: Trophy,          badge: null },
      { path: "/admin/events",   label: "Event",       icon: CalendarDays,    badge: null },
    ],
  },
  {
    title: "Administrasi",
    items: [
      { path: "/admin/reports",  label: "Laporan",     icon: TrendingUp,      badge: null },
      { path: "/admin/settings", label: "Pengaturan",  icon: Settings2,       badge: null },
    ],
  },
];

// ─── Dice logo ────────────────────────────────────────────────────────────────
function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-5 py-5 shrink-0"
         style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
           style={{ background: "linear-gradient(135deg,#45A1FD,#82C2FF)" }}>
        🎲
      </div>
      <div>
        <p style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "15px", color: "white", lineHeight: 1.2 }}>
          Sebangku
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", fontWeight: 700,
                    color: "#82C2FF", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Admin Panel
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AdminSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const session: AdminSession = JSON.parse(
    sessionStorage.getItem("sbk_admin_session") || "{}"
  );

  const handleLogout = () => {
    sessionStorage.removeItem("sbk_admin_session");
    navigate("/admin", { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/admin/dashboard" && location.pathname.startsWith(path));

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        style={{
          width: "240px",
          backgroundColor: "#1C1410",
          borderRight: "1px solid rgba(69,161,253,0.12)",
        }}
      >
        {/* Logo */}
        <div className="relative">
          <SidebarLogo />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 lg:hidden w-7 h-7 flex items-center justify-center
                       rounded-lg text-white/40 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-none">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} className={si > 0 ? "mt-3" : ""}>
              {section.title && (
                <p
                  className="px-3 mb-1"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 cursor-pointer group transition-all"
                    style={{
                      backgroundColor: active
                        ? "#45A1FD"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(69,161,253,0.12)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <item.icon
                      size={15}
                      style={{ color: active ? "white" : "rgba(255,255,255,0.45)", flexShrink: 0 }}
                    />
                    <span
                      className="flex-1 truncate"
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "13px",
                        fontWeight: active ? 700 : 500,
                        color: active ? "white" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          backgroundColor: active
                            ? "rgba(255,255,255,0.25)"
                            : "#DC2626",
                          color: "white",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div
          className="shrink-0 px-4 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Role badge */}
          <div className="flex items-center gap-1.5 mb-3">
            <Shield size={10} style={{ color: "#82C2FF" }} />
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "9px",
                fontWeight: 700,
                color: "#82C2FF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {session.role ?? "Admin"}
            </span>
          </div>

          {/* Avatar + info */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg,#45A1FD,#82C2FF)",
                fontFamily: "'Fraunces',serif",
                fontWeight: 700,
                fontSize: "15px",
                color: "white",
              }}
            >
              {(session.name ?? "A").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  color: "white",
                }}
              >
                {session.name ?? "Admin"}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {session.email ?? ""}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
            style={{ border: "1px solid rgba(239,68,68,0.2)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            <LogOut size={13} style={{ color: "#F87171" }} />
            <span
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "12px",
                color: "#F87171",
                fontWeight: 600,
              }}
            >
              Keluar
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

