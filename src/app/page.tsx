import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, RefreshCw, Star, Leaf, Heart, Wind, Droplets } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/products/ProductCard'
import type { ProductWithCategory } from '@/types'

async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  return prisma.product.findMany({
    where: { featured: true, isActive: true },
    include: { category: true, reviews: true },
    take: 4,
  })
}

async function getCategories() {
  return prisma.category.findMany({ take: 4 })
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  const benefits = [
    { icon: Shield, title: 'Ethically Sourced', desc: 'Hand-selected natural raw crystals, minimally polished to preserve their authentic texture and energy.' },
    { icon: Truck, title: 'Worldwide Shipping', desc: 'Free shipping within the US on orders over $50. International delivery in 7–20 business days.' },
    { icon: RefreshCw, title: '30-Day Returns', desc: 'Shop with confidence. Hassle-free returns and exchanges within 30 days of delivery.' },
    { icon: Star, title: 'Handcrafted Quality', desc: 'Artisan hand-strung and moonlight-cleansed, every bracelet carries an intentional healing energy.' },
  ]

  const healingProps = [
    { icon: Heart, label: 'Ease Inner Tension', color: 'text-rose-400', bg: 'bg-rose-50' },
    { icon: Wind, label: 'Soothe Anxiety', color: 'text-crystal-500', bg: 'bg-crystal-50' },
    { icon: Droplets, label: 'Cleanse Energy', color: 'text-sky-500', bg: 'bg-sky-50' },
    { icon: Leaf, label: 'Return to Nature', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-to-br from-crystal-50 via-white to-mist-50">
        <div className="absolute top-10 right-0 w-[480px] h-[480px] bg-crystal-200/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-mist-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-moss-200/15 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-crystal-100 text-crystal-700 rounded-full mb-6 text-sm py-1.5 px-4 font-medium">
                <Leaf className="w-4 h-4" />
                Natural Raw Crystals · Artisan Handcrafted
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
                Healed by
                <span className="block text-crystal-600">the Earth</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Mountains hold time, crystals hold the cosmos. Each natural gemstone is a gentle gift from millions of years of earth — a sliver of starlight resting on your wrist, quiet and healing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary text-lg px-8 py-4">
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/about" className="btn-secondary text-lg px-8 py-4">
                  Our Story
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 text-sm text-gray-500 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <span>4.9 / 5 rating</span>
                </div>
                <span>•</span>
                <span>2,400+ happy customers</span>
                <span>•</span>
                <span>Ships to 50+ countries</span>
              </div>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-crystal-300/40 to-mist-300/30 rounded-3xl rotate-3 opacity-40" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800"
                    alt="lsle of Mist — Healing Crystal Bracelets"
                    width={600}
                    height={600}
                    className="object-cover w-full"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-crystal-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-crystal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Certified Natural</p>
                    <p className="text-sm font-semibold text-gray-900">100% Natural Crystals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healing Properties */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {healingProps.map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className={`flex flex-col items-center gap-3 p-6 rounded-2xl ${bg} text-center`}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className="font-medium text-gray-800 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Strip */}
      <section className="py-20 bg-crystal-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600')] bg-cover bg-center opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-crystal-600 text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" /> Our Story
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-snug">
            A million years in the making,<br className="hidden sm:block" /> resting gently on your wrist
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            Life holds so many quiet exhaustions — the relentless pace, the unexpected waves of anxiety, the wordless burnout that settles like mist around your heart, slowly stealing your sense of peace.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            lsle of Mist was born from a simple longing: to bring nature's stillness closer. To let each crystal become a personal sanctuary — a gentle companion that soothes without words, and holds you steady when the world feels too loud.
          </p>
          <Link href="/about" className="btn-primary">
            Read Our Full Story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">Shop by Collection</h2>
            <p className="text-gray-500">Find the healing intention that speaks to you</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-crystal-900/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-serif font-bold text-lg leading-tight">{cat.name}</h3>
                  <span className="text-white/80 text-sm flex items-center gap-1 mt-1">
                    Shop now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-crystal-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">Featured Collection</h2>
              <p className="text-gray-500">Our most beloved healing bracelets</p>
            </div>
            <Link href="/products" className="btn-ghost text-crystal-600 hover:text-crystal-700">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 bg-crystal-50 rounded-2xl shadow-sm flex items-center justify-center border border-crystal-100">
                  <Icon className="w-7 h-7 text-crystal-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-mist-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-gray-500">Real stories from the lsle of Mist community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', country: '🇺🇸 USA', rating: 5, text: 'The amethyst bracelet is stunning! I wear it every day and genuinely feel calmer. The packaging was beautiful — like receiving a gift from the forest.' },
              { name: 'Emma T.', country: '🇬🇧 UK', rating: 5, text: 'Ordered the 7 chakra bracelet and received it in 10 days. The quality is remarkable, each bead perfectly smooth. The misty, nature-inspired brand feel is so unique.' },
              { name: 'Mia L.', country: '🇦🇺 Australia', rating: 5, text: 'I bought the rose quartz bracelet as a gift. The crystal story card was such a thoughtful touch — felt like unwrapping a piece of nature itself.' },
            ].map(review => (
              <div key={review.name} className="card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-crystal-100 rounded-full flex items-center justify-center font-serif font-bold text-crystal-700">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-crystal-800 to-crystal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Leaf className="w-10 h-10 mx-auto mb-4 text-crystal-300" />
          <h2 className="text-4xl font-serif font-bold mb-4">One crystal. A thousand moments of calm.</h2>
          <p className="text-crystal-200 text-lg mb-2">
            Use code <strong className="text-white">MIST10</strong> for 10% off your first order
          </p>
          <p className="text-crystal-300 text-sm mb-8">May starlight rest on your wrist and peace walk beside you</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white text-crystal-700 font-semibold px-8 py-4 rounded-full hover:bg-crystal-50 transition-colors text-lg">
            Explore All Collections
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
