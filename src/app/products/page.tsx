import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/products/ProductCard'
import type { ProductWithCategory } from '@/types'
import { Filter } from 'lucide-react'
import Link from 'next/link'

interface ProductsPageProps {
  searchParams: {
    category?: string
    sort?: string
    min?: string
    max?: string
    healing?: string
  }
}

async function getProducts(params: ProductsPageProps['searchParams']): Promise<ProductWithCategory[]> {
  const where: any = { isActive: true }

  if (params.category) {
    where.category = { slug: params.category }
  }

  if (params.min || params.max) {
    where.price = {}
    if (params.min) where.price.gte = parseFloat(params.min)
    if (params.max) where.price.lte = parseFloat(params.max)
  }

  if (params.healing) {
    where.healing = { contains: params.healing }
  }

  let orderBy: any = { createdAt: 'desc' }
  if (params.sort === 'price-asc') orderBy = { price: 'asc' }
  if (params.sort === 'price-desc') orderBy = { price: 'desc' }
  if (params.sort === 'featured') orderBy = { featured: 'desc' }

  return prisma.product.findMany({
    where,
    include: { category: true, reviews: true },
    orderBy,
  })
}

async function getCategories() {
  return prisma.category.findMany()
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ])

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
  ]

  const currentCategory = categories.find(c => c.slug === searchParams.category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-crystal-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">{currentCategory?.name ?? 'All Products'}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-5">
              <Filter className="w-4 h-4 text-crystal-600" />
              <h2 className="font-semibold text-gray-900">Filters</h2>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Collections</h3>
              <div className="space-y-2">
                <Link
                  href="/products"
                  className={`block text-sm px-3 py-2 rounded-lg transition-colors ${!searchParams.category ? 'bg-crystal-100 text-crystal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  All Products ({products.length})
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`block text-sm px-3 py-2 rounded-lg transition-colors ${searchParams.category === cat.slug ? 'bg-crystal-100 text-crystal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Healing intentions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Healing Intention</h3>
              <div className="space-y-2">
                {['Love', 'Protection', 'Abundance', 'Anxiety Relief', 'Spiritual Growth', 'Blessing'].map(h => (
                  <Link
                    key={h}
                    href={`/products?healing=${encodeURIComponent(h)}`}
                    className={`block text-sm px-3 py-2 rounded-lg transition-colors ${searchParams.healing === h ? 'bg-crystal-100 text-crystal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {h}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
              <div className="space-y-2">
                {[
                  { label: 'Under $35', min: '0', max: '35' },
                  { label: '$35 – $50', min: '35', max: '50' },
                  { label: 'Over $50', min: '50', max: '200' },
                ].map(r => (
                  <Link
                    key={r.label}
                    href={`/products?min=${r.min}&max=${r.max}`}
                    className={`block text-sm px-3 py-2 rounded-lg transition-colors ${searchParams.min === r.min && searchParams.max === r.max ? 'bg-crystal-100 text-crystal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {currentCategory?.name ?? 'All Products'}
              <span className="text-base font-normal text-gray-400 ml-2">({products.length})</span>
            </h1>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:block">Sort:</span>
              <div className="flex gap-2">
                {sortOptions.map(opt => (
                  <Link
                    key={opt.value}
                    href={`/products?${new URLSearchParams({ ...searchParams, sort: opt.value }).toString()}`}
                    className={`hidden sm:block text-xs px-3 py-1.5 rounded-full border transition-colors ${searchParams.sort === opt.value || (!searchParams.sort && opt.value === 'featured') ? 'border-crystal-600 bg-crystal-50 text-crystal-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <Link href="/products" className="btn-primary">Browse All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
