'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
      const data = await res.json()
      toast.success(data.message ?? 'Done')
      router.refresh()
    } catch {
      toast.error('Delete failed')
    } finally {
      setLoading(false)
      setConfirm(false)
    }
  }

  if (confirm) return (
    <span className="inline-flex items-center gap-1">
      <button onClick={handleDelete} disabled={loading}
        className="text-xs text-white bg-red-500 hover:bg-red-600 px-1.5 py-0.5 rounded font-medium">
        {loading ? '...' : 'Yes'}
      </button>
      <button onClick={() => setConfirm(false)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
    </span>
  )

  return (
    <button onClick={() => setConfirm(true)}
      className="text-red-400 hover:text-red-600 text-xs font-medium">
      Delete
    </button>
  )
}
