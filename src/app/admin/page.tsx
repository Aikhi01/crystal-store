import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Package, ShoppingCart, Users, TrendingUp, ChevronRight } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin')
  }

  const [
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCustomers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid' } }),
    prisma.product.count(),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { items: { take: 1 } },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: 'asc' },
      take: 5,
    }),
  ])

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue._sum.total ?? 0), icon: TrendingUp, color: 'bg-green-500', bg: 'bg-green-50' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart, color: 'bg-blue-500', bg: 'bg-blue-50' },
    { label: 'Products', value: totalProducts.toString(), icon: Package, color: 'bg-crystal-500', bg: 'bg-crystal-50' },
    { label: 'Customers', value: totalCustomers.toString(), icon: Users, color: 'bg-rose-500', bg: 'bg-rose-50' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome, {session.user.name}</span>
      </div>

      {/* Quick links */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <Link href="/admin/products" className="btn-primary text-sm py-2">Manage Products</Link>
        <Link href="/admin/orders" className="btn-secondary text-sm py-2">Manage Orders</Link>
        <Link href="/" className="btn-ghost text-sm">View Store</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 text-${color.replace('bg-', '')}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-crystal-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${order.status === 'paid' ? 'badge-green' : order.status === 'pending' ? 'badge-yellow' : 'badge-purple'}`}>
                    {order.status}
                  </span>
                  <span className="font-medium text-sm">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock warning */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">⚠️ Low Stock Alert</h2>
            <Link href="/admin/products" className="text-sm text-crystal-600 hover:underline flex items-center gap-1">
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockProducts.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400 text-center">All products well-stocked ✓</p>
            ) : lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">SKU: {p.sku}</p>
                </div>
                <span className={`badge ${p.stock === 0 ? 'badge-red' : 'badge-yellow'}`}>
                  {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
