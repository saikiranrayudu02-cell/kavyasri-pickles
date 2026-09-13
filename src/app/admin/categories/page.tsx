'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Eye, EyeOff, FolderTree, CheckCircle2 } from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { Category } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/pickles/mango.jpg');

  const loadCategories = () => {
    setCategories(DataStore.getCategories());
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('/images/pickles/mango.jpg');
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImageUrl(cat.image_url);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const catToSave: Category = {
      id: editingCat ? editingCat.id : `cat-${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      image_url: imageUrl,
      is_active: editingCat ? editingCat.is_active : true,
      display_order: editingCat ? editingCat.display_order : categories.length + 1,
    };

    DataStore.saveCategory(catToSave);
    loadCategories();
    setShowModal(false);
    showToast(editingCat ? `Updated ${name}!` : `Created category ${name}!`, 'success');
  };

  const handleToggle = (cat: Category) => {
    const updated = { ...cat, is_active: !cat.is_active };
    DataStore.saveCategory(updated);
    loadCategories();
    showToast(`${cat.name} is now ${updated.is_active ? 'Active' : 'Disabled'}.`, 'info');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      DataStore.deleteCategory(id);
      loadCategories();
      showToast(`Category ${name} deleted.`, 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-2xl border border-white/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Taxonomy Management
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
            Pickle Categories ({categories.length})
          </h1>
          <p className="text-xs text-stone-500 font-medium">Organize store shelves, sub-categories, and customer navigation menus.</p>
        </div>

        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-linear-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_16px_rgba(22,101,52,0.25)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white/70 backdrop-blur-2xl rounded-3xl p-5 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-stone-100/80 border border-stone-200/80 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-stone-900 leading-snug tracking-tight truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-400 font-mono block truncate">/{cat.slug}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-medium">{cat.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200/60">
              <button
                onClick={() => handleToggle(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold transition-all active:scale-95 ${
                  cat.is_active
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs'
                    : 'bg-stone-100/80 text-stone-500 border border-stone-200/50'
                }`}
              >
                {cat.is_active ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-stone-400" />}
                <span>{cat.is_active ? 'Active on Store' : 'Hidden'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100/80 transition-colors active:scale-90"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50/80 transition-colors active:scale-90"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Sheet Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-md transition-all animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-white/80 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl text-stone-900 mb-1 tracking-tight">
              {editingCat ? 'Edit Category' : 'Create New Category'}
            </h3>
            <p className="text-xs text-stone-500 mb-5 font-medium">
              Configure name, store slug, and showcase imagery.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCat) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Traditional Veg Pickles"
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium transition-all text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="traditional-veg-pickles"
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-mono text-stone-600 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of this pickle collection..."
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 transition-all text-stone-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-mono text-stone-600 transition-all"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100/80 rounded-2xl transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-linear-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white rounded-2xl text-xs font-semibold shadow-[0_4px_16px_rgba(22,101,52,0.25)] transition-all active:scale-95"
                >
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
