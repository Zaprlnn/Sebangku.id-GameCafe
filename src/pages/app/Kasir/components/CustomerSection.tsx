// src/pages/app/Kasir/components/CustomerSection.tsx
import React, { useState } from 'react';
import { Search, UserPlus, User } from 'lucide-react';
import type { Customer } from '../hooks/useKasirSupabase';

interface Props {
  customers: Customer[];
  onSelectCustomer: (customer: { id: number; name: string }) => void;
  onRegisterCustomer: (name: string, phone?: string) => Promise<{ error: unknown }>;
}

export const CustomerSection = ({ customers, onSelectCustomer, onRegisterCustomer }: Props) => {
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const handleRegister = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    await onRegisterCustomer(newName.trim(), newPhone.trim() || undefined);
    setNewName('');
    setNewPhone('');
    setShowForm(false);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Cari nama atau nomor HP..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Register New Customer Toggle */}
      <button
        onClick={() => setShowForm(v => !v)}
        className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        {showForm ? 'Batal Daftar' : 'Daftarkan Customer Baru'}
      </button>

      {/* New Customer Form */}
      {showForm && (
        <div className="p-4 bg-gray-900 border border-amber-500/30 rounded-xl space-y-3">
          <input
            type="text"
            placeholder="Nama lengkap *"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="No. HP (opsional)"
            value={newPhone}
            onChange={e => setNewPhone(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleRegister}
            disabled={loading || !newName.trim()}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-sm rounded-lg transition-colors"
          >
            {loading ? 'Menyimpan...' : 'Simpan Customer'}
          </button>
        </div>
      )}

      {/* Customer List */}
      <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-8">
            {search ? 'Customer tidak ditemukan.' : 'Belum ada customer terdaftar.'}
          </p>
        ) : (
          filtered.map(customer => (
            <button
              key={customer.id}
              onClick={() => onSelectCustomer({ id: customer.id, name: customer.name })}
              className="w-full flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-amber-500/50 rounded-xl text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20">
                <User className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-100">{customer.name}</p>
                {customer.phone && (
                  <p className="text-xs text-gray-500">{customer.phone}</p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
