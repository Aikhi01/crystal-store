import Link from 'next/link'
import { Truck, Package, Globe, Clock } from 'lucide-react'

export default function ShippingPage() {
  const zones = [
    { flag: '🇺🇸', region: 'United States', standard: '5–8 days — $4.99 (Free over $125)', express: '2–3 days — $14.99' },
    { flag: '🇬🇧🇪🇺', region: 'Europe', standard: '10–18 days — $12.99 (Free over $80)', express: '4–7 days — $28.99' },
    { flag: '🇨🇦🇦🇺', region: 'Canada & Australia', standard: '8–15 days — $9.99 (Free over $70)', express: '4–7 days — $24.99' },
    { flag: '🌏', region: 'Asia Pacific', standard: '12–20 days — $14.99 (Free over $80)', express: '5–8 days — $32.99' },
    { flag: '🌍', region: 'Rest of World', standard: '15–30 days — $18.99 (Free over $100)', express: 'Not available' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Shipping Policy</h1>
      <p className="text-gray-500 mb-10">We ship worldwide with love and care. Every order is carefully packaged with eco-friendly materials.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { icon: Package, title: 'Processing Time', desc: 'Orders are processed within 1–2 business days after payment confirmation.' },
          { icon: Truck, title: 'Shipping Carriers', desc: 'We use USPS, FedEx, and DHL depending on your location and selected service.' },
          { icon: Globe, title: 'Worldwide Delivery', desc: 'We deliver to 50+ countries. Import duties may apply at destination customs.' },
          { icon: Clock, title: 'Order Tracking', desc: 'Tracking numbers are emailed once your order ships. Allow 24h for updates.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-5 flex gap-4">
            <div className="w-10 h-10 bg-crystal-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-crystal-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">{title}</p>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Shipping Rates by Region</h2>
      <div className="card overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">Region</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">Standard</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">Express</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {zones.map(z => (
              <tr key={z.region} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{z.flag} {z.region}</td>
                <td className="px-5 py-3 text-gray-600">{z.standard}</td>
                <td className="px-5 py-3 text-gray-600">{z.express}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-crystal-50 rounded-2xl p-6 text-sm text-crystal-800">
        <p className="font-semibold mb-2">📦 Important Notes</p>
        <ul className="space-y-1.5 list-disc list-inside text-crystal-700">
          <li>International orders may be subject to customs duties and taxes at the destination country.</li>
          <li>Delivery times are estimates and may vary due to customs clearance or carrier delays.</li>
          <li>We are not responsible for delays caused by customs or incorrect address information.</li>
          <li>Lost or stolen packages: contact us within 30 days of the estimated delivery date.</li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 mb-3">Questions about your order?</p>
        <Link href="/contact" className="btn-primary">Contact Us</Link>
      </div>
    </div>
  )
}
