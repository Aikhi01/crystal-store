'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulated send (in production, wire to email API like Resend/SendGrid)
    await new Promise(r => setTimeout(r, 1000))
    toast.success("Message sent! We'll reply within 24 hours ✨")
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Get in Touch</h1>
        <p className="text-gray-500">We love hearing from our crystal community.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-5">
          {[
            { icon: Mail, title: 'Email Us', detail: 'hello@crystalhealing.co', sub: 'For orders & general enquiries' },
            { icon: MessageSquare, title: 'Live Chat', detail: 'Chat on site', sub: 'Available Mon–Fri, 9am–5pm EST' },
            { icon: Clock, title: 'Response Time', detail: 'Within 24 hours', sub: 'Usually much faster!' },
          ].map(({ icon: Icon, title, detail, sub }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 bg-crystal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-crystal-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-crystal-600 text-sm">{detail}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Your Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="Jane Smith" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="jane@email.com" required />
            </div>
          </div>
          <div>
            <label className="label">Subject</label>
            <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input" required>
              <option value="">Select a topic...</option>
              <option>Order Status / Tracking</option>
              <option>Returns & Refunds</option>
              <option>Product Question</option>
              <option>Wholesale Enquiry</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              className="input min-h-[140px] resize-none"
              placeholder="Tell us how we can help..."
              required
            />
          </div>
          <button type="submit" disabled={sending} className="btn-primary w-full py-3">
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
