import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";

const PAGE_SIZE = 5;

function isoWeekStart(): string {
  const d = new Date(); d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
}
function isoMonthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
function isoToday(): string { return new Date().toISOString().slice(0, 10); }
function formatRp(n: number): string { return "Rp " + n.toLocaleString("id-ID"); }
function formatK(v: number) {
  return v >= 1000000
    ? `Rp ${(v / 1000000).toFixed(1).replace(".", ",")}jt`
    : `Rp ${(v / 1000).toFixed(0)}k`;
}

function getHeatColor(val: number): string {
  const levels = ["", "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A"];
  return levels[Math.min(val, levels.length - 1)] || "#F8FAFC";
}

const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heatmapHours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export default function ReportsView() {
  const [period, setPeriod] = useState<"week" | "month" | "custom">("month");
  const [startDate, setStartDate] = useState(isoWeekStart());
  const [endDate, setEndDate] = useState(isoToday());
  const [txPage, setTxPage] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('dashboard_transactions').select('*').order('created_at', { ascending: false });
      if (data) {
        setAllTransactions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      const txDate = tx.created_at.split('T')[0];
      if (period === "week") {
        return txDate >= isoWeekStart() && txDate <= isoToday();
      } else if (period === "month") {
        return txDate >= isoMonthStart() && txDate <= isoToday();
      } else {
        return txDate >= startDate && txDate <= endDate;
      }
    });
  }, [allTransactions, period, startDate, endDate]);

  // Aggregate Data
  const { revenueTrendData, totalFnB, totalRental, totalRevenue } = useMemo(() => {
    const dailyMap: Record<string, { fnb: number, rental: number }> = {};
    let tFnb = 0;
    let tRental = 0;
    
    filteredTransactions.forEach(tx => {
      const dateStr = tx.created_at.split('T')[0];
      if (!dailyMap[dateStr]) dailyMap[dateStr] = { fnb: 0, rental: 0 };
      
      const fnb = Number(tx.fnb_total) || 0;
      const rnt = Number(tx.rental_total) || 0;
      
      dailyMap[dateStr].fnb += fnb;
      dailyMap[dateStr].rental += rnt;
      tFnb += fnb;
      tRental += rnt;
    });

    const trendData = Object.keys(dailyMap).sort().map(date => {
      const d = new Date(date);
      const dayLabel = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
      return {
        date,
        day: dayLabel,
        fnb: dailyMap[date].fnb,
        rental: dailyMap[date].rental,
      };
    });

    return {
      revenueTrendData: trendData.length > 0 ? trendData : [{ date: isoToday(), day: "Today", fnb: 0, rental: 0 }],
      totalFnB: tFnb,
      totalRental: tRental,
      totalRevenue: tFnb + tRental
    };
  }, [filteredTransactions]);

  // Temporary mock for Top items and heatmap since transactions table only has "items" text field
  const topSellingItems = [
    { name: "Es Kopi Susu", value: 98 },
    { name: "Mie Goreng",   value: 85 },
    { name: "Kopi Hitam",   value: 72 },
    { name: "Snack Mix",    value: 58 },
    { name: "Nasi Goreng",  value: 44 },
  ];
  const topGamesData = [
    { name: "Pandemic",       value: 34, color: "#1E40AF" },
    { name: "Catan",          value: 28, color: "#3B82F6" },
    { name: "Ticket to Ride", value: 22, color: "#93C5FD" },
    { name: "Wingspan",       value: 19, color: "#BFDBFE" },
    { name: "Others",         value: 83, color: "#DBEAFE" },
  ];
  const heatmapData: Record<string, Record<number, number>> = {
    Mon: { 10:1,11:2,12:3,13:4,14:3,15:4,16:5,17:6,18:7,19:5,20:3,21:1 },
    Tue: { 10:2,11:3,12:4,13:5,14:4,15:5,16:6,17:7,18:6,19:4,20:2,21:1 },
    Wed: { 10:1,11:2,12:3,13:4,14:5,15:6,16:7,17:8,18:7,19:6,20:4,21:2 },
    Thu: { 10:2,11:3,12:2,13:4,14:3,15:5,16:6,17:7,18:8,19:7,20:5,21:3 },
    Fri: { 10:1,11:2,12:4,13:5,14:6,15:7,16:8,17:9,18:8,19:7,20:6,21:4 },
    Sat: { 10:3,11:4,12:5,13:6,14:5,15:4,16:5,17:6,18:5,19:4,20:3,21:2 },
    Sun: { 10:2,11:3,12:4,13:3,14:2,15:3,16:4,17:5,18:4,19:3,20:2,21:1 },
  };

  const totalSessionsCount = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const pagedTx = filteredTransactions.slice((txPage - 1) * PAGE_SIZE, txPage * PAGE_SIZE);

  const handleExportCSV = useCallback(() => {
    const header = "Date,Customer,Items,Rental,Total,Payment,Status";
    const rows = filteredTransactions.map(t =>
      `${t.created_at.split('T')[0]},${t.customer_name},"${t.items}",${t.rental_total},${t.total_amount},${t.payment_method},${t.status}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transaksi_sebangku.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [filteredTransactions]);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-[#0F172A]">Reports &amp; Analytics</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {(["week", "month", "custom"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                period === p
                  ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow"
                  : "bg-white text-[#64748B] border-slate-200 hover:border-[#3B82F6]"
              }`}
            >
              {p === "week" ? "This Week" : p === "month" ? "This Month" : "Custom"}
            </button>
          ))}
          {period === "custom" && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="focus:outline-none border-none text-[#0F172A] font-medium"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="focus:outline-none border-none text-[#0F172A] font-medium"
              />
            </div>
          )}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-[#0F172A] hover:border-[#3B82F6] transition-all"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-[#0F172A] hover:border-[#3B82F6] transition-all"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TOTAL REVENUE",   value: formatRp(totalRevenue), accent: "#0F172A",  border: "border-t-2 border-t-slate-200" },
          { label: "F&B REVENUE",     value: formatRp(totalFnB), accent: "#0F172A",  border: "border-t-2 border-t-slate-200" },
          { label: "RENTAL REVENUE",  value: formatRp(totalRental), accent: "#0F172A",  border: "border-t-2 border-t-slate-200" },
          { label: "TOTAL TRANSACTIONS", value: `${totalSessionsCount} txs`, accent: "#16A34A", border: "border-t-2 border-t-emerald-400" },
        ].map((card) => (
          <div key={card.label} className={`bg-white rounded-xl border border-slate-100 ${card.border} p-5 shadow-sm`}>
            <p className="text-[9px] font-black uppercase text-[#94A3B8] tracking-widest mb-1">{card.label}</p>
            <h3 className={`text-2xl font-black`} style={{ color: card.accent }}>{card.value}</h3>
          </div>
        ))}
      </div>

      {/* ── Row: Revenue Trend + Top Selling Items ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 lg:col-span-3">
          <h3 className="text-sm font-bold text-[#0F172A] mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueTrendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatK} tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`Rp ${v.toLocaleString("id-ID")}`, ""]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line type="monotone" dataKey="fnb"    stroke="#1D4ED8" strokeWidth={2} dot={false} name="F&B" />
              <Line type="monotone" dataKey="rental" stroke="#93C5FD" strokeWidth={2} dot={false} name="Rental" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-[#0F172A] mb-4">Top Selling Items</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topSellingItems} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {topSellingItems.map((_item, i) => (
                  <Cell key={i} fill={`rgba(30,64,175,${1 - i * 0.15})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row: Peak Hours Heatmap + Top Played Games ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Heatmap */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 lg:col-span-3">
          <h3 className="text-sm font-bold text-[#0F172A] mb-4">Peak Hours Heatmap</h3>
          <div className="overflow-x-auto">
            <table className="text-[10px]" style={{ borderSpacing: "3px", borderCollapse: "separate" }}>
              <thead>
                <tr>
                  <td className="w-8" />
                  {heatmapHours.map(h => (
                    <th key={h} className="font-semibold text-[#94A3B8] text-center pb-1" style={{ width: 28 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapDays.map(day => (
                  <tr key={day}>
                    <td className="font-semibold text-[#94A3B8] pr-2 py-0.5">{day}</td>
                    {heatmapHours.map(h => (
                      <td key={h} title={`${day} ${h}:00 — intensity ${heatmapData[day][h]}`}>
                        <div
                          style={{
                            width: 22, height: 22,
                            borderRadius: 4,
                            backgroundColor: getHeatColor(heatmapData[day][h]),
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Legend */}
            <div className="flex items-center gap-1 mt-3">
              <span className="text-[10px] text-[#94A3B8] mr-1">Low</span>
              {[1,3,5,7,9].map(v => (
                <div key={v} style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: getHeatColor(v) }} />
              ))}
              <span className="text-[10px] text-[#94A3B8] ml-1">High</span>
            </div>
          </div>
        </div>

        {/* Top Played Games */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-[#0F172A] mb-4">Top Played Games</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={topGamesData}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={78}
                dataKey="value"
                startAngle={90} endAngle={-270}
              >
                {topGamesData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-col gap-1.5 mt-2">
            {topGamesData.map(g => (
              <div key={g.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: g.color, flexShrink: 0 }} />
                  <span className="text-[#64748B]">{g.name}</span>
                </div>
                <span className="font-bold text-[#0F172A]">{g.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Transaction Log ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#0F172A]">Transaction Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Date", "Customer", "Items", "F&B Total", "Rental Total", "Total", "Payment", "Status"].map(col => (
                  <th key={col} className="px-4 py-3 text-left text-[11px] font-bold text-[#3B82F6] uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedTx.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">No transactions found for this period.</td>
                </tr>
              ) : pagedTx.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-[#64748B] text-xs whitespace-nowrap">{tx.created_at.split('T')[0]}</td>
                  <td className="px-4 py-3 font-bold text-[#0F172A] text-xs whitespace-nowrap">{tx.customer_name}</td>
                  <td className="px-4 py-3 text-[#64748B] text-xs max-w-[200px] truncate" title={tx.items}>{tx.items}</td>
                  <td className="px-4 py-3 text-[#64748B] text-xs whitespace-nowrap">{formatRp(tx.fnb_total || 0)}</td>
                  <td className="px-4 py-3 text-[#64748B] text-xs whitespace-nowrap">{formatRp(tx.rental_total || 0)}</td>
                  <td className="px-4 py-3 font-bold text-[#0F172A] text-xs whitespace-nowrap">{formatRp(tx.total_amount || 0)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.payment_method === "QRIS"     ? "bg-blue-50 text-blue-600 border border-blue-200" :
                      tx.payment_method === "Transfer" ? "bg-purple-50 text-purple-600 border border-purple-200" :
                                                  "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {tx.payment_method}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                      tx.status === "Pending"   ? "bg-amber-50 text-amber-600 border border-amber-200" :
                                                  "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 py-4 border-t border-slate-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setTxPage(p)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                  p === txPage
                    ? "bg-[#3B82F6] text-white shadow"
                    : "bg-white text-[#64748B] border border-slate-200 hover:border-[#3B82F6]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
