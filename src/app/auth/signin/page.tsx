'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      router.push(callbackUrl)
      router.refresh()
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
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="label mb-0">Password</label>
                <Link href="/auth/forgot-password" className="text-sm text-crystal-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
            <p className="font-medium mb-1">Demo Accounts:</p>
            <p>Customer: customer@test.com / customer123</p>
            <p>Admin: admin@crystalhealing.co / admin123456</p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-crystal-600 hover:underline font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
