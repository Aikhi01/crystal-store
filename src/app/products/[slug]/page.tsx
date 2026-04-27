'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ShoppingBag, Star, Shield, Truck, Leaf, ChevronLeft, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { ProductWithCategory } from '@/types'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'healing' | 'shipping'>('description')
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-crystal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-xl">Product not found</p>
        <Link href="/products" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  const images: string[] = JSON.parse(product.images)
  const healing: string[] = product.healing ? JSON.parse(product.healing) : []
  const reviews = product.reviews ?? []
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-cart`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || '',
        slug: product.slug,
        weight: product.weight,
      })
    }
    toast.success(`${quantity}× ${product.name} added to cart!`, { icon: '✨' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-crystal-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-crystal-600">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category?.slug}`} className="hover:text-crystal-600">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
            <Image
              src={images[selectedImage] || images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-crystal-500' : 'border-transparent'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.crystalType && <span className="badge-purple">{product.crystalType}</span>}
            {product.chakra && <span className="badge bg-amber-100 text-amber-700">{product.chakra} Chakra</span>}
            {product.featured && <span className="badge bg-crystal-600 text-white">✨ Featured</span>}
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          {avgRating !== null && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
            {product.comparePrice && (
              <span className="badge bg-red-100 text-red-700">
                Save {formatPrice(product.comparePrice - product.price)}
              </span>
            )}
          </div>

          {/* Healing properties quick tags */}
          {healing.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {healing.map(h => (
                <span key={h} className="inline-flex items-center gap-1 text-sm bg-crystal-50 text-crystal-700 px-3 py-1 rounded-full">
                  <Leaf className="w-3 h-3" />
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Stock */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="mb-4 p-3 bg-orange-50 rounded-xl text-sm text-orange-700">
              ⚡ Only <strong>{product.stock}</strong> left in stock!
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-400">{product.stock} available</span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary w-full text-lg py-4 mb-4 disabled:opacity-50"
          >
            <ShoppingBag className="w-5 h-5" />
            {product.stock === 0 ? 'Out of Stock' : `Add to Cart — ${formatPrice(product.price * quantity)}`}
          </button>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Shield, text: 'Authentic Crystals' },
              { icon: Truck, text: 'Fast Shipping' },
              { icon: ChevronLeft, text: '30-Day Returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center">
                <Icon className="w-4 h-4 text-crystal-600" />
                <span className="text-xs text-gray-600">{text}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              {(['description', 'healing', 'shipping'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-crystal-600 text-crystal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'healing' ? 'Crystal Story' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="text-gray-700 leading-relaxed text-sm">
            {activeTab === 'description' && <p>{product.description}</p>}
            {activeTab === 'healing' && (
              <div>
                <p className="mb-4">{product.story || product.description}</p>
                {healing.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Healing Properties:</h4>
                    <ul className="space-y-1">
                      {healing.map(h => (
                        <li key={h} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-crystal-500 rounded-full" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p>🇺🇸 <strong>United States:</strong> Standard (5-8 days, free over $50) or Express (2-3 days)</p>
                <p>🇬🇧🇪🇺 <strong>Europe:</strong> Standard (10-18 days, free over $80) or Express (4-7 days)</p>
                <p>🇦🇺🇨🇦 <strong>Canada & Australia:</strong> Standard (8-15 days, free over $70)</p>
                <p>🌏 <strong>Asia Pacific:</strong> Standard (12-20 days) or Express (5-8 days)</p>
                <p className="mt-4 text-gray-500">All orders are packaged with eco-friendly materials and include a crystal care guide. Tracking provided for all shipments.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map(review => (
              <div key={review.id} className="card p-5">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                {review.title && <p className="font-semibold text-gray-900 mb-1">{review.title}</p>}
                <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
                {review.verified && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600">
                    <Shield className="w-3 h-3" />
                    Verified Purchase
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
