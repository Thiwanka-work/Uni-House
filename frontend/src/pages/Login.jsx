import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [shake, setShake] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Add robot animation when submitting
    setTimeout(async () => {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Success animation
        if (result.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        setError(result.message)
        // Shake animation for error
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
      setLoading(false)
    }, 1000)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed relative py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url('/login-bg.png')`
        }}
      >
        <div className={`max-w-md w-full space-y-8 transition-all duration-500 bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-sm ${shake ? 'animate-shake' : ''}`}>

          {/* Animated Header */}
          <div className="text-center">
            <div className="mx-auto w-24 h-24 mb-4 relative">
              {/* Robot Animation */}
              <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-700 ${loading ? 'animate-bounce rotate-12' : 'hover:scale-110'}`}>
                <div className="text-white text-2xl">
                  {loading ? '🤖' : '🔑'}
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back!
            </h2>
            <p className="mt-2 text-gray-600 text-lg">
              Sign in to your Uni House account
            </p>
          </div>

          {/* Animated Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl animate-pulse flex items-center space-x-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email Input with Animation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>📧</span>
                <span>Email Address</span>
              </label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 transform group-hover:scale-105 placeholder-gray-400 text-gray-900 bg-white shadow-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400 group-hover:text-blue-500 transition-colors">✉️</span>
                </div>
              </div>
            </div>

            {/* Password Input with Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>🔒</span>
                <span>Password</span>
              </label>
              <div className="relative group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 transform group-hover:scale-105 placeholder-gray-400 text-gray-900 bg-white shadow-sm pr-12"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button with Robot Animation */}
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center items-center space-x-3 py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${loading
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>🤖 Robot is working...</span>
                </>
              ) : (
                <>
                  <span className="transform transition-transform group-hover:scale-110">🚀</span>
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Progress Bar for Loading */}
            {loading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"></div>
              </div>
            )}

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-300 hover:underline inline-flex items-center space-x-1"
                >
                  <span>Sign up now</span>
                  <span className="transform transition-transform hover:translate-x-1">➡️</span>
                </Link>
              </p>
            </div>
          </form>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-blue-300 rounded-full opacity-50 animate-float"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-purple-300 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-300 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      </div>
      <Footer />
    </>
  )
}

export default Login