import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, AlertCircle } from "lucide-react";

export default function DeleteConfirmModal(props: any) {
  const { deleteConfirm, setDeleteConfirm, executeDelete, isDeleting } = props;
  if (!deleteConfirm) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={() => setDeleteConfirm(null)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div className="text-center">
            <h3 className="font-black text-[#0F172A] text-base">Hapus Item?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Item ini akan dihapus dari inventori dan juga dari halaman kasir.
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={executeDelete}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
