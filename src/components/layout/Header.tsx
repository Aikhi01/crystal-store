'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, User, Menu, X, Search, Leaf } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useSession, signOut } from 'next-auth/react'
import CartDrawer from '@/components/cart/CartDrawer'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const totalItems = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0))

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=chakra-sets', label: 'Chakra Sets' },
    { href: '/products?category=chinese-zodiac', label: 'Chinese Zodiac' },
    { href: '/products?category=zodiac-signs', label: 'Zodiac Signs' },
    { href: '/products?category=love-romance', label: 'Love & Romance' },
    { href: '/about', label: 'Our Story' },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'}`}>
        <div className="bg-crystal-700 text-white text-center py-2 text-sm font-medium tracking-wide">
          🌿 Free Shipping on orders over $125 &nbsp;|&nbsp; First order 10% off with code <strong>MIST10</strong>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold text-crystal-800 tracking-wide">
              <Leaf className="w-6 h-6 text-crystal-500" />
              lsle of Mist
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-crystal-600 font-medium transition-colors text-sm tracking-wide whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href="/search" className="p-2 text-gray-600 hover:text-crystal-600 transition-colors">
                <Search className="w-5 h-5" />
              </Link>

              {session ? (
                <div className="relative group hidden md:block">
                  <button className="p-2 text-gray-600 hover:text-crystal-600 transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                    <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                    {session.user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-crystal-600 hover:bg-gray-50">Admin Dashboard</Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/signin" className="hidden md:flex p-2 text-gray-600 hover:text-crystal-600 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              )}

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-crystal-600 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-crystal-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-gray-700 hover:text-crystal-600 font-medium"
                >
                  {link.label}
                </Link>
              ))}

              {session ? (
                <>
                  <Link href="/account/orders" onClick={() => setMenuOpen(false)} className="block py-2.5 text-gray-700">My Orders</Link>
                  <button onClick={() => signOut()} className="block py-2.5 text-red-600">Sign Out</button>
                </>
              ) : (
                <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="block py-2.5 text-gray-700">Sign In</Link>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-[calc(64px+36px)]" />
    </>
  )
}
