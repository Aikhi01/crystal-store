import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') redirect('/auth/signin')

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Products</h1>
        <div className="flex gap-3">
          <Link href="/admin" className="btn-ghost text-sm">← Dashboard</Link>
          <Link href="/admin/products/new" className="btn-primary text-sm">+ Add Product</Link>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Product</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Price</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Stock</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(product => {
              const images: string[] = JSON.parse(product.images)
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {images[0] && (
                          <Image src={images[0]} alt={product.name} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category.name}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{formatPrice(product.price)}</p>
                    {product.comparePrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${product.stock === 0 ? 'badge-red' : product.stock <= 5 ? 'badge-yellow' : 'badge-green'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${product.isActive ? 'badge-green' : 'badge-red'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-crystal-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >
                        Preview
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
