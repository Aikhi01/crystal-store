import Link from 'next/link'
import { RefreshCw, CheckCircle, XCircle, Mail } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Returns & Refunds</h1>
      <p className="text-gray-500 mb-10">We want you to love your crystals. If something's not right, we'll make it right.</p>

      <div className="card p-6 mb-6 flex gap-4">
        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
          <RefreshCw className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-1">30-Day Return Policy</h2>
          <p className="text-gray-600">Return any item within 30 days of delivery for a full refund or exchange. No questions asked.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Eligible for Return</h3>
          </div>
          <ul className="text-sm text-green-800 space-y-1.5 list-disc list-inside">
            <li>Unworn items in original condition</li>
            <li>Items with original packaging</li>
            <li>Defective or damaged items</li>
            <li>Wrong item received</li>
          </ul>
        </div>
        <div className="bg-red-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-900">Not Eligible</h3>
          </div>
          <ul className="text-sm text-red-800 space-y-1.5 list-disc list-inside">
            <li>Items worn or used</li>
            <li>Items returned after 30 days</li>
            <li>Custom / personalized items</li>
            <li>Items missing original packaging</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">How to Return</h2>
      <div className="space-y-4 mb-8">
        {[
          { step: '1', title: 'Contact Us', desc: 'Email hello@crystalhealing.co with your order number and reason for return.' },
          { step: '2', title: 'Get Approval', desc: 'We\'ll confirm your return and provide a return shipping address within 24 hours.' },
          { step: '3', title: 'Ship It Back', desc: 'Pack the item securely and ship it back. We recommend using a tracked service.' },
          { step: '4', title: 'Receive Your Refund', desc: 'Once received and inspected, your refund is processed within 3–5 business days to your original payment method.' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4 items-start">
            <div className="w-9 h-9 bg-crystal-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{step}</div>
            <div>
              <p className="font-semibold text-gray-900">{title}</p>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center p-6 bg-crystal-50 rounded-2xl">
        <Mail className="w-8 h-8 text-crystal-600 mx-auto mb-2" />
        <p className="font-semibold text-gray-900 mb-1">Start a Return</p>
        <p className="text-gray-500 text-sm mb-4">Email us your order number and we'll take it from there.</p>
        <a href="mailto:hello@crystalhealing.co?subject=Return Request" className="btn-primary">Email Returns Team</a>
      </div>
    </div>
  )
}
