'use client'

import { useState } from 'react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        onLoginSuccess()
        onClose()
        setEmail('')
        setPassword('')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(email, password)
  }

  const handleTestUserLogin = () => {
    handleLogin('test@test.com', 'PassWord@123#1')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl shadow-xl max-w-md w-full p-6 relative" style={{backgroundColor: 'rgb(254, 251, 247)'}}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110"
        >
          <img 
            src="/assets/apple.png" 
            alt="Close" 
            className="w-6 h-6"
          />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/assets/fruit.jpg" alt="Fruit Bowl" className="w-12 h-12 rounded-full object-cover" />
          <h2 className="text-3xl font-normal text-gray-900 tracking-tight font-inter">Log In</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-16 px-4 text-lg font-inter rounded-lg focus:outline-none text-black"
              style={{
                boxShadow: '0 0 0 1px rgba(156, 163, 175, 0.3)',
                transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 2px rgba(156, 163, 175, 0.3)'
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 0 0 1px rgba(156, 163, 175, 0.3)'
              }}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 px-4 text-lg font-inter rounded-lg focus:outline-none text-black"
              style={{
                boxShadow: '0 0 0 1px rgba(156, 163, 175, 0.3)',
                transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 2px rgba(156, 163, 175, 0.3)'
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 0 0 1px rgba(156, 163, 175, 0.3)'
              }}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="flex-1 flex flex-col items-center gap-2 px-4 py-3 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <img 
                src="/assets/hamburger.png" 
                alt="Login" 
                className={`w-6 h-6 transition-opacity ${
                  isLoading || !email.trim() || !password.trim() ? 'opacity-60' : 'opacity-100'
                }`} 
              />
              <span className="font-semibold">{isLoading ? 'Logging in...' : 'Log In'}</span>
            </button>
            
            <button
              type="button"
              onClick={handleTestUserLogin}
              disabled={isLoading}
              className="flex-1 flex flex-col items-center gap-2 px-4 py-3 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <img src="/assets/hamburger.png" alt="Test User" className="w-6 h-6" />
              <span className="font-semibold">Login Test User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
