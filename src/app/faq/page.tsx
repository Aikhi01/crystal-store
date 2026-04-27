'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  { q: 'Are your crystals real and authentic?', a: 'Yes, 100%. We source all our crystals directly from ethical mines and certified suppliers. Every stone is natural, unenhanced, and comes with a guarantee of authenticity.' },
  { q: 'How do I know which crystal is right for me?', a: 'Trust your intuition! Browse our collection and notice which crystals you feel drawn to. We also include a crystal story card with every order to guide you. If you need help, contact us — we love helping people find their perfect crystal.' },
  { q: 'How should I care for my crystal bracelet?', a: 'Avoid submerging in water for long periods, as some crystals are water-sensitive. To cleanse, place in moonlight overnight or use sage smoke. Remove before swimming or exercising. Store in the pouch provided when not wearing.' },
  { q: 'Do you offer free shipping?', a: 'Yes! We offer free standard shipping on US orders over $50, European orders over $80, and Canadian/Australian orders over $70. Thresholds are shown at checkout.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy. If you are not completely satisfied, return your item in its original condition for a full refund or exchange. Custom or personalized items cannot be returned.' },
  { q: 'How long will my order take to arrive?', a: 'US standard shipping takes 5–8 business days, express 2–3 days. International orders typically take 10–20 business days depending on your location. You will receive tracking once shipped.' },
  { q: 'Can I use a discount code?', a: "Yes! Enter your discount code at checkout. First-time customers can use HEALING10 for 10% off. Codes cannot be combined and have no cash value." },
  { q: 'Do you ship internationally?', a: 'We ship to over 50 countries worldwide. International orders may be subject to customs duties and taxes imposed by your country, which are the buyer\'s responsibility.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you will receive an email with your tracking number and a link to track your package. You can also view your tracking info in My Orders if you have an account.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be cancelled or modified within 12 hours of placing them. After that, the order enters processing. Please contact us immediately if you need to make changes.' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3 text-center">Frequently Asked Questions</h1>
      <p className="text-gray-500 text-center mb-10">Everything you need to know about our crystals and your order.</p>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
              {open === i
                ? <ChevronUp className="w-5 h-5 text-crystal-500 flex-shrink-0" />
                : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center p-6 bg-crystal-50 rounded-2xl">
        <p className="text-gray-700 font-medium mb-2">Still have questions?</p>
        <p className="text-gray-500 text-sm mb-4">We typically reply within 24 hours.</p>
        <a href="mailto:hello@crystalhealing.co" className="btn-primary">Email Us</a>
      </div>
    </div>
  )
}
