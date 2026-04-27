'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Registration failed')
        return
      }
      // Auto sign in
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      toast.success('Account created! Welcome ✨')
      router.push('/')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-crystal-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-serif text-2xl font-bold text-crystal-700 mb-6">
            <Sparkles className="w-6 h-6 text-crystal-500" />
            Crystal Healing Co.
          </Link>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500">Join our healing community</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Jane Smith"
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-crystal-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
