import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Heart, Globe, Shield, Wind } from 'lucide-react'

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-28 bg-gradient-to-br from-crystal-50 via-white to-mist-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-crystal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-mist-200/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-crystal-600 text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" /> Isle of Mist · Our Story
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Guided by Stars,<br />Carried with Gentleness
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            The story behind Isle of Mist healing crystal bracelets
          </p>
        </div>
      </section>

      {/* Story — Part 1 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Mountains hold time. Crystals hold the cosmos.</h2>
              <div className="space-y-5 text-gray-700 leading-loose text-[1.05rem]">
                <p>
                  All things in nature carry a spirit. Mountains hold centuries. Crystals hold the universe. Formed over millions of years through the earth's quiet labour and steeped in starlight, every natural crystal becomes a gentle, healing gift from the world to us.
                </p>
                <p>
                  Each of our lives holds countless small exhaustions — the relentless daily pace, the sudden waves of anxiety, the unspoken burnout, the thoughts that circle through restless nights — settling like layer upon layer of mist around the heart, until we slowly lose the calm, unhurried self we once knew.
                </p>
                <p>
                  We longed for quiet healing. For a moment of warmth and steadiness within a restless world. That longing is the reason <strong className="text-crystal-700">lsle of Mist</strong> healing crystal bracelets exist.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800"
                  alt="Forest and mist landscape"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-lg p-4 max-w-[180px]">
                <p className="text-xs text-gray-400 mb-1">Straight from the earth</p>
                <p className="text-sm font-semibold text-crystal-700 leading-snug">Natural Raw · Million-Year Origin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story — Part 2 */}
      <section className="py-16 bg-crystal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"
                  alt="Morning forest light"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Crafted with intention. True to nature.</h2>
              <div className="space-y-5 text-gray-700 leading-loose text-[1.05rem]">
                <p>
                  Our artisans hand-select natural raw crystals and polish them only lightly — preserving the stone's authentic texture and the energy it has held for millennia. Each crystal has been forged through the earth's long patience, absorbing the light of sun and moon and the stillness of mountains and rivers.
                </p>
                <p>
                  Within the clear, luminous crystal body lives a peace that belongs only to the natural world. Light moves through it in quiet fragments — like starlight, softly scattered — resting on your wrist, tender and healing.
                </p>
                <p>
                  We believe crystals are containers for emotion and a harbour for the soul. They do not shout or demand attention. Yet they quietly sense the feelings of those who wear them, gently settling the restlessness beneath the surface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story — Quote */}
      <section className="py-20 bg-crystal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Wind className="w-10 h-10 mx-auto mb-6 text-crystal-300 opacity-60" />
          <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed text-crystal-100 mb-8">
            "When stress presses in and your thoughts won't quiet, the crystal rests gently against your skin — its warmth spreading slowly, like a soft embrace, silently clearing the shadows from your heart."
          </blockquote>
          <div className="space-y-4 text-crystal-200 leading-relaxed max-w-xl mx-auto">
            <p>Wear it in the morning to begin your day with clarity and calm. Let it rest with you at night as starlight soothes the weight of the day. In a world that moves too fast, it helps you filter the noise, settle your thoughts, and stay rooted when life feels uncertain.</p>
          </div>
        </div>
      </section>

      {/* Story — Final */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">One crystal. A thousand moments of calm.</h2>
          <div className="space-y-5 text-gray-700 leading-loose text-[1.05rem] text-left">
            <p>
              This healing crystal bracelet is more than a beautiful accessory. It is a gentle ritual of self-restoration — carrying the quiet power of nature, helping you face the everyday, embrace your feelings, and slowly, tenderly, heal.
            </p>
            <p>
              May starlight rest on your wrist in every season that follows. May you find peace, walk beside beauty, and live each day with clarity and each year with grace.
            </p>
          </div>
          <Link href="/products" className="btn-primary mt-10 inline-flex text-lg px-8 py-4">
            Explore the Collection
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-mist-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-10">Our Commitments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: 'Ethically Sourced', desc: 'We partner only with ethical, eco-conscious mineral sources to preserve the crystal\'s authentic energy.' },
              { icon: Heart, title: 'Made with Love', desc: 'Each bracelet is hand-strung by artisans and moonlight-cleansed before shipping — packed with genuine care.' },
              { icon: Globe, title: 'Ships Worldwide', desc: 'Eco-friendly packaging, delivered to 50+ countries. Nature\'s healing has no borders.' },
              { icon: Shield, title: '100% Authentic', desc: 'No synthetic or dyed stones — ever. Every crystal is verified natural and traceable to its source.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm text-center border border-crystal-100">
                <div className="w-14 h-14 bg-crystal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-crystal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
