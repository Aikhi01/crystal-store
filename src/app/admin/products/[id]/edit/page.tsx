'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ImageUploader from '@/components/admin/ImageUploader'

interface Category { id: string; name: string }

const DEFAULT_FORM = {
  name: '', description: '', story: '', price: '', comparePrice: '',
  stock: '0', sku: '', weight: '20', categoryId: '',
  featured: false, isActive: true, crystalType: '', chakra: '', healing: '',
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState(DEFAULT_FORM)

  useEffect(() => {
    // Load categories + product in parallel
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch(`/api/admin/products/${id}`).then(r => r.json()),
    ]).then(([cats, product]) => {
      setCategories(cats)
      if (product.error) { toast.error(product.error); return }
      setImages(JSON.parse(product.images || '[]'))
      setForm({
        name: product.name ?? '',
        description: product.description ?? '',
        story: product.story ?? '',
        price: String(product.price ?? ''),
        comparePrice: product.comparePrice ? String(product.comparePrice) : '',
        stock: String(product.stock ?? 0),
        sku: product.sku ?? '',
        weight: String(product.weight ?? 20),
        categoryId: product.categoryId ?? '',
        featured: product.featured ?? false,
        isActive: product.isActive ?? true,
        crystalType: product.crystalType ?? '',
        chakra: product.chakra ?? '',
        healing: product.healing
          ? JSON.parse(product.healing).join(', ')
          : '',
      })
    }).catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) { toast.error('Please add at least one image'); return }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        story: form.story || undefined,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        images: JSON.stringify(images),
        stock: parseInt(form.stock),
        sku: form.sku,
        weight: parseFloat(form.weight),
        categoryId: form.categoryId,
        featured: form.featured,
        isActive: form.isActive,
        crystalType: form.crystalType || undefined,
        chakra: form.chakra || undefined,
        healing: form.healing
          ? JSON.stringify(form.healing.split(',').map(s => s.trim()).filter(Boolean))
          : undefined,
      }
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Save failed'); return }
      toast.success('Product saved!')
      router.push('/admin/products')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Delete failed'); return }
      toast.success(data.message ?? 'Product deleted')
      router.push('/admin/products')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-crystal-600 border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-gray-400">Loading product...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/products" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">← Back to Products</Link>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Edit Product</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/products/${form.name ? form.name.toLowerCase().replace(/\s+/g,'-') : ''}`} target="_blank"
            className="btn-ghost text-sm">Preview ↗</Link>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
              <span className="text-sm text-red-600 font-medium">Sure?</span>
              <button onClick={handleDelete} disabled={deleting}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded font-medium hover:bg-red-600">
                {deleting ? '...' : 'Yes, delete'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Basic Information</h2>

          <div>
            <label className="label">Product Name *</label>
            <input type="text" value={form.name} onChange={set('name')} required className="input" placeholder="e.g. Amethyst Serenity Bracelet" />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea value={form.description} onChange={set('description')} required rows={4} className="input resize-none" placeholder="Describe the product — materials, size, appearance..." />
          </div>

          <div>
            <label className="label">Crystal Story / Metaphysical Properties</label>
            <textarea value={form.story} onChange={set('story')} rows={4} className="input resize-none" placeholder="The history and healing energy of this crystal..." />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Pricing & Inventory</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (USD) *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={set('price')} required className="input" placeholder="38.00" />
            </div>
            <div>
              <label className="label">Compare-at Price <span className="text-gray-400 text-xs">(optional, shows as crossed-out)</span></label>
              <input type="number" step="0.01" min="0" value={form.comparePrice} onChange={set('comparePrice')} className="input" placeholder="52.00" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Stock Quantity *</label>
              <input type="number" min="0" value={form.stock} onChange={set('stock')} required className="input" />
            </div>
            <div>
              <label className="label">SKU *</label>
              <input type="text" value={form.sku} onChange={set('sku')} required className="input" placeholder="AME-001" />
            </div>
            <div>
              <label className="label">Weight (g)</label>
              <input type="number" min="0" value={form.weight} onChange={set('weight')} className="input" placeholder="25" />
            </div>
          </div>

          <div>
            <label className="label">Category *</label>
            <select value={form.categoryId} onChange={set('categoryId')} required className="input">
              <option value="">Select category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Product Images</h2>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Crystal Properties */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Crystal Properties</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Crystal Type</label>
              <input type="text" value={form.crystalType} onChange={set('crystalType')} className="input" placeholder="Amethyst" />
            </div>
            <div>
              <label className="label">Chakra</label>
              <input type="text" value={form.chakra} onChange={set('chakra')} className="input" placeholder="Crown & Third Eye" />
            </div>
          </div>

          <div>
            <label className="label">Healing Properties <span className="text-gray-400 text-xs">(comma-separated)</span></label>
            <input type="text" value={form.healing} onChange={set('healing')} className="input" placeholder="Anxiety Relief, Better Sleep, Inner Peace" />
          </div>
        </div>

        {/* Visibility */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Visibility</h2>
          <div className="flex gap-8">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 accent-crystal-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Active</p>
                <p className="text-xs text-gray-400">Visible in the storefront</p>
              </div>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.featured}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 accent-crystal-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Featured</p>
                <p className="text-xs text-gray-400">Shown on the homepage</p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 text-base">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/products" className="btn-secondary px-6">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
