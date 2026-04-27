'use client'

import { useRef, useState } from 'react'
import { Upload, X, GripVertical, Image as ImageIcon, Link } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  images: string[]          // current list of image URLs
  onChange: (urls: string[]) => void
}

export default function ImageUploader({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      const d = await res.json()
      toast.error(d.error ?? 'Upload failed')
      return null
    }
    const { url } = await res.json()
    return url
  }

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (arr.length === 0) return
    if (images.length + arr.length > 5) {
      toast.error('Maximum 5 images per product')
      return
    }
    setUploading(true)
    const urls: string[] = []
    for (const file of arr) {
      const url = await uploadFile(file)
      if (url) urls.push(url)
    }
    if (urls.length) onChange([...images, ...urls])
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleAddUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (images.length >= 5) { toast.error('Maximum 5 images'); return }
    if (images.includes(url)) { toast.error('URL already added'); return }
    onChange([...images, url])
    setUrlInput('')
    setShowUrlInput(false)
  }

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    ;[next[from], next[to]] = [next[to], next[from]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {images.map((url, idx) => (
            <div key={url + idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
              <img src={url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = '' }} />
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-crystal-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Cover</span>
              )}
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => moveImage(idx, idx - 1)} disabled={idx === 0}
                  className="p-1 bg-white/80 rounded text-gray-700 hover:bg-white disabled:opacity-30 text-xs">◀</button>
                <button type="button" onClick={() => removeImage(idx)}
                  className="p-1 bg-red-500 rounded text-white hover:bg-red-600">
                  <X className="w-3 h-3" />
                </button>
                <button type="button" onClick={() => moveImage(idx, idx + 1)} disabled={idx === images.length - 1}
                  className="p-1 bg-white/80 rounded text-gray-700 hover:bg-white disabled:opacity-30 text-xs">▶</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone — only show if under 5 images */}
      {images.length < 5 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
            ${dragOver ? 'border-crystal-400 bg-crystal-50' : 'border-gray-300 hover:border-crystal-400 hover:bg-gray-50'}`}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-crystal-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">
                {dragOver ? 'Drop to upload' : 'Click or drag images here'}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 5MB · Up to 5 images</p>
            </div>
          )}
        </div>
      )}

      {/* URL input toggle */}
      {images.length < 5 && (
        <div>
          {showUrlInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                placeholder="https://images.unsplash.com/..."
                className="input text-sm flex-1"
                autoFocus
              />
              <button type="button" onClick={handleAddUrl} className="btn-primary text-sm px-4">Add</button>
              <button type="button" onClick={() => setShowUrlInput(false)} className="btn-ghost text-sm">Cancel</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="flex items-center gap-1.5 text-sm text-crystal-600 hover:text-crystal-700 font-medium"
            >
              <Link className="w-4 h-4" /> Add image by URL
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {images.length}/5 images · First image is the cover photo · Drag ◀ ▶ to reorder
      </p>
    </div>
  )
}
