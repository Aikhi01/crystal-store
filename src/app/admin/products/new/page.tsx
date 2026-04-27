'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ImageUploader from '@/components/admin/ImageUploader'

interface Category { id: string; name: string }

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '', description: '', story: '', price: '', comparePrice: '',
    stock: '0', sku: '', weight: '20', categoryId: '',
    featured: false, isActive: true, crystalType: '', chakra: '',
    healing: '',
  })

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) { toast.error('Please add at least one image'); return }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        story: form.story || undefined,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
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
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast.success('Product created!')
        router.push('/admin/products')
      } else {
        const d = await res.json()
        toast.error(d.error || 'Failed to create product')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/products" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">← Back to Products</Link>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Add New Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="label">Compare-at Price <span className="text-gray-400 text-xs">(optional)</span></label>
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
            {saving ? 'Creating...' : 'Create Product'}
          </button>
          <Link href="/admin/products" className="btn-secondary px-6">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
