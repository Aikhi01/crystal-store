'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { ProductWithCategory } from '@/types'

interface ProductCardProps {
  product: ProductWithCategory
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem)
  const images: string[] = JSON.parse(product.images)
  const healing: string[] = product.healing ? JSON.parse(product.healing) : []
  const discount = product.comparePrice
    ? getDiscountPercent(product.price, product.comparePrice)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || '',
      slug: product.slug,
      weight: product.weight,
    })
    toast.success(`${product.name} added to cart!`, {
      icon: '✨',
      style: { background: '#f5ebff', color: '#581c87' },
    })
  }

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card hover:shadow-md transition-shadow duration-200">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={images[0] || 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <span className="badge bg-rose-500 text-white">-{discount}%</span>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-crystal-600 text-white">✨ Featured</span>
            </div>
          )}

          {/* Quick add */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 btn-primary py-2 px-4 text-sm whitespace-nowrap disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Category & crystal */}
          <div className="flex items-center gap-2 mb-2">
            {product.crystalType && (
              <span className="badge-purple text-xs">{product.crystalType}</span>
            )}
            {product.chakra && (
              <span className="text-xs text-gray-400">{product.chakra}</span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-crystal-600 transition-colors">
            {product.name}
          </h3>

          {/* Healing tags */}
          {healing.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {healing.slice(0, 2).map(h => (
                <span key={h} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          {avgRating !== null && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews?.length})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-orange-600 mt-1">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-gray-400 mt-1">Out of stock</p>
          )}
        </div>
      </div>
    </Link>
  )
}
