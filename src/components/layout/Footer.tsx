import Link from 'next/link'
import { Leaf, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-crystal-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-serif text-xl font-bold mb-4 tracking-wide">
              <Leaf className="w-5 h-5 text-crystal-400" />
              Isle of Mist
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Where the forest meets the mist. Every natural crystal carries the quiet healing power of the earth — handcrafted for your journey.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-crystal-800 rounded-lg hover:bg-crystal-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-crystal-800 rounded-lg hover:bg-crystal-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-crystal-800 rounded-lg hover:bg-crystal-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=healing-crystals" className="hover:text-white transition-colors">Healing Crystals</Link></li>
              <li><Link href="/products?category=chakra-sets" className="hover:text-white transition-colors">Chakra Sets</Link></li>
              <li><Link href="/products?category=chinese-zodiac" className="hover:text-white transition-colors">Chinese Zodiac Collection</Link></li>
              <li><Link href="/products?category=love-romance" className="hover:text-white transition-colors">Love & Romance</Link></li>
              <li><Link href="/products?category=fortune-blessings" className="hover:text-white transition-colors">Fortune & Blessings</Link></li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-4">Subscribe for crystal healing tips and exclusive offers.</p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-2.5 bg-crystal-800 border border-crystal-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-crystal-400"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-crystal-600 hover:bg-crystal-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-crystal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Isle of Mist. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-crystal-800 rounded border border-crystal-700">VISA</span>
            <span className="px-2 py-1 bg-crystal-800 rounded border border-crystal-700">MC</span>
            <span className="px-2 py-1 bg-crystal-800 rounded border border-crystal-700">AMEX</span>
            <span className="px-2 py-1 bg-crystal-800 rounded border border-crystal-700">PayPal</span>
            <span className="px-2 py-1 bg-crystal-800 rounded border border-crystal-700">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
