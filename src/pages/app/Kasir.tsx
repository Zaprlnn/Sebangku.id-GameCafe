import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Calculator, LogOut } from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

export default function KasirPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "T01";

  return (
    <div className="min-h-screen flex bg-[#F1F5F9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex w-[220px] shrink-0 flex-col"
        style={{ background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)", minHeight: "100vh", position: "sticky", top: 0, height: "100vh" }}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={sebangkuLogo} alt="Sebangku" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <div>
            <p className="text-white font-black text-sm leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>Sebangku</p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Kasir</p>
          </div>
        </div>
        <div className="flex-1 px-3 py-4 flex flex-col gap-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(59,130,246,0.2)", color: "#60A5FA" }}>
            <Calculator size={16} />
            <span className="text-sm font-semibold">Dashboard Kasir</span>
          </div>
        </div>
        <div className="px-3 pb-5">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5" style={{ color: "rgba(255,255,255,0.45)" }}>
            <LogOut size={16} />
            <span className="text-sm font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="w-20 h-20 bg-[#EFF6FF] rounded-3xl flex items-center justify-center">
            <Calculator size={36} className="text-[#3B82F6]" />
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-3xl font-black text-[#0F172A]">
            Kasir Dashboard
          </h1>
          <p className="text-[#64748B] max-w-sm">
            Halaman kasir sedang dalam pengembangan. Fitur pengelolaan transaksi, pembayaran, dan laporan akan segera hadir.
          </p>
          <span className="bg-[#FEF3C7] text-[#D97706] text-sm font-bold px-4 py-1.5 rounded-full">🚧 Coming Soon</span>
        </motion.div>
      </div>
    </div>
  );
}
