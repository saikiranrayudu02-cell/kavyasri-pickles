'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Home,
  Building2,
  Phone,
  User,
  X,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import AccountHeader from '@/components/account/AccountHeader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface AddressItem {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New address state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newLine2, setNewLine2] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');

  useEffect(() => {
    if (!user) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadAddresses() {
      if (isSupabaseConfigured && supabase && user?.id) {
        try {
          const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user.id);

          if (!error && data && isMounted) {
            const mapped: AddressItem[] = data.map((a) => ({
              id: a.id,
              name: a.full_name || 'Delivery Address',
              phone: a.phone || '',
              line1: a.address_line1,
              line2: a.address_line2 || '',
              city: a.city,
              state: a.state,
              pincode: a.pincode,
              isDefault: Boolean(a.is_default),
            }));
            setAddresses(mapped);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching Supabase addresses:', err);
        }
      }

      // Local storage fallback scoped by user ID
      try {
        const saved = localStorage.getItem(`kp_addresses_${user?.id}`);
        if (saved && isMounted) {
          setAddresses(JSON.parse(saved));
        } else if (isMounted) {
          setAddresses([]);
        }
      } catch {
        if (isMounted) setAddresses([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAddresses();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const saveToLocal = (newAddresses: AddressItem[]) => {
    setAddresses(newAddresses);
    if (user?.id) {
      localStorage.setItem(`kp_addresses_${user.id}`, JSON.stringify(newAddresses));
    }
  };

  const handleDelete = async (id: string) => {
    const nextAddresses = addresses.filter((a) => a.id !== id);
    saveToLocal(nextAddresses);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('addresses').delete().eq('id', id);
    }
    showToast('Delivery address removed.', 'info');
  };

  const handleSetDefault = async (id: string) => {
    const nextAddresses = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    saveToLocal(nextAddresses);

    if (isSupabaseConfigured && supabase && user?.id) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
      await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);
    }
    showToast('Default delivery address updated.', 'success');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    const addressUuid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `70000000-0000-4000-8000-${Date.now().toString().slice(-12)}`;

    const item: AddressItem = {
      id: addressUuid,
      name: newName.trim(),
      phone: newPhone.trim(),
      line1: newLine1.trim(),
      line2: newLine2.trim(),
      city: newCity.trim(),
      state: newState.trim(),
      pincode: newPincode.trim(),
      isDefault: addresses.length === 0,
    };

    const nextAddresses = [...addresses, item];
    saveToLocal(nextAddresses);

    if (isSupabaseConfigured && supabase && user?.id) {
      await supabase.from('addresses').insert({
        id: addressUuid,
        user_id: user.id,
        full_name: newName.trim(),
        phone: newPhone.trim(),
        address_line1: newLine1.trim(),
        address_line2: newLine2.trim() || null,
        city: newCity.trim(),
        state: newState.trim(),
        pincode: newPincode.trim(),
        is_default: addresses.length === 0,
      });
    }

    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewLine1('');
    setNewLine2('');
    setNewCity('');
    setNewState('');
    setNewPincode('');
    showToast('New delivery address added successfully!', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AccountHeader activeTab="addresses" addressCount={addresses.length} />

        {/* Section Header with Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              Saved Delivery Addresses ({addresses.length})
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Addresses saved here are automatically available during 1-click checkout.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-2xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Addresses Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 border-3 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-semibold text-stone-500">Loading your address book...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add Address Card Trigger */}
            <button
              onClick={() => setShowAddModal(true)}
              className="group flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-stone-300 hover:border-[#166534] bg-stone-50/50 hover:bg-emerald-50/20 text-stone-500 hover:text-[#166534] transition-all min-h-55"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#166534] text-stone-400 group-hover:text-white flex items-center justify-center mb-3 shadow-xs transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-serif font-bold text-sm text-stone-900 group-hover:text-[#166534]">
                Add Another Address
              </span>
              <span className="text-[11px] text-stone-400 mt-1">
                Home, Parents, Office or Friends
              </span>
            </button>

            {addresses.map((addr) => {
              const isHome = addr.name.toLowerCase().includes('home');
              const isOffice = addr.name.toLowerCase().includes('office') || addr.name.toLowerCase().includes('work');

              return (
                <div
                  key={addr.id}
                  className={`p-6 rounded-3xl bg-white border-2 transition-all relative flex flex-col justify-between ${
                    addr.isDefault
                      ? 'border-[#166534] shadow-md shadow-[#166534]/5'
                      : 'border-stone-200/80 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Label & Default Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                          {isHome ? (
                            <Home className="w-4 h-4 text-[#166534]" />
                          ) : isOffice ? (
                            <Building2 className="w-4 h-4 text-[#d97706]" />
                          ) : (
                            <MapPin className="w-4 h-4 text-stone-600" />
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-base text-stone-900">
                          {addr.name}
                        </h3>
                      </div>

                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#166534] text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Default
                        </span>
                      )}
                    </div>

                    {/* Phone Number */}
                    {addr.phone && (
                      <p className="text-xs text-stone-500 mb-3 flex items-center gap-1.5 font-medium">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{addr.phone}</span>
                      </p>
                    )}

                    {/* Address Text */}
                    <div className="text-xs text-stone-600 space-y-1 leading-relaxed bg-[#faf7f2] p-3.5 rounded-2xl border border-stone-200/60">
                      <p className="font-medium text-stone-800">{addr.line1}</p>
                      {addr.line2 && <p className="text-stone-500">{addr.line2}</p>}
                      <p className="font-bold text-stone-900 pt-1">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100 text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-bold text-[#166534] hover:text-[#14532d] hover:underline"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400 font-semibold">
                        Primary delivery destination
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1 ml-auto"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for adding a new address */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 animate-scale-up">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-stone-900">
                      Add Delivery Address
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      For doorstep pickle delivery anywhere in India.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Label / Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Home, Office, Anita Rao"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    House / Flat No, Street, Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLine1}
                    onChange={(e) => setNewLine1(e.target.value)}
                    placeholder="e.g. Flat 302, Sai Residency, Road No. 12"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Landmark / Colony (Optional)
                  </label>
                  <input
                    type="text"
                    value={newLine2}
                    onChange={(e) => setNewLine2(e.target.value)}
                    placeholder="e.g. Near Heritage Supermarket"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Hyderabad"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      placeholder="Telangana"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      placeholder="500034"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
