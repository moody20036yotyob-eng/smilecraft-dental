import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiLogin } from '../../hooks/useApi'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiLogin(password)
      navigate('/admin')
    } catch {
      setError('Invalid password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.5 2 5 5 5 9c0 3 2 5.5 3.5 7L10 21h4l1.5-5C17 14.5 19 12 19 9c0-4-3.5-7-7-7z" fill="white" opacity=".9"/>
              <circle cx="12" cy="9" r="2.5" fill="#00B5B0"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">SmileCraft Dental</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-card p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Admin Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              placeholder="Enter admin password" autoFocus />
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center bg-red-50 border border-red-100 py-2.5 rounded-xl">{error}</p>
          )}

          <button type="submit" disabled={!password || loading}
            className="btn-primary w-full py-4 justify-center disabled:opacity-40">
            {loading ? '⏳ Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-xs">
          <a href="/" className="hover:text-brand-500 transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  )
}
