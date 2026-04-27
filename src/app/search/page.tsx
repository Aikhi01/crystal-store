import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/products/ProductCard'
import { Search } from 'lucide-react'
import Link from 'next/link'
import type { ProductWithCategory } from '@/types'

interface SearchPageProps {
  searchParams: { q?: string }
}

async function searchProducts(query: string): Promise<ProductWithCategory[]> {
  if (!query) return []
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { crystalType: { contains: query } },
        { chakra: { contains: query } },
        { healing: { contains: query } },
      ],
    },
    include: { category: true, reviews: true },
    take: 20,
  })
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ?? ''
  const results = await searchProducts(query)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Search</h1>

      {/* Search box */}
      <form className="mb-10">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search crystals, healing intentions..."
            className="input pl-12 text-lg py-4"
            autoFocus
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm">
            Search
          </button>
        </div>
      </form>

      {query && (
        <p className="text-gray-500 mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;<strong>{query}</strong>&rdquo;
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-sm text-gray-400 mb-6">Try &ldquo;amethyst&rdquo;, &ldquo;love&rdquo;, or &ldquo;protection&rdquo;</p>
          <Link href="/products" className="btn-primary">Browse All Crystals</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['amethyst', 'rose quartz', 'chakra', 'protection', 'love', 'abundance', 'anxiety', 'grounding'].map(tag => (
            <Link
              key={tag}
              href={`/search?q=${tag}`}
              className="px-4 py-3 bg-crystal-50 rounded-xl text-crystal-700 text-sm font-medium text-center hover:bg-crystal-100 transition-colors capitalize"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
