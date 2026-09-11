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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Pickle Categories ({categories.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">Organize your store shelves and customer navigation.</p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 leading-tight">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-400 font-mono">/{cat.slug}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2">{cat.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100">
              <button
                onClick={() => handleToggle(cat)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  cat.is_active
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {cat.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{cat.is_active ? 'Active' : 'Disabled'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-emerald-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-4">
              {editingCat ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Category Name</label>
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
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="traditional-veg-pickles"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-mono text-stone-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of this pickle collection..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 text-stone-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold shadow"
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
