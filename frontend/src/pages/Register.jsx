import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [shake, setShake] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error when user starts typing
    if (error) setError('')

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength += 25
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setLoading(true)

    // Animation delay
    setTimeout(async () => {
      const { confirmPassword, ...registerData } = formData
      const result = await register(registerData)

      if (result.success) {
        navigate('/login')
      } else {
        setError(result.message)
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
      setLoading(false)
    }, 1500)
  }

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return '🎓'
      case 'owner': return '🏠'
      case 'service': return '🔧'
      default: return '👤'
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed relative py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url('/register-bg.png')`
      }}
    >
      <div className={`max-w-md w-full space-y-8 transition-all duration-500 bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-sm ${shake ? 'animate-shake' : ''}`}>

        {/* Animated Header */}
        <div className="text-center">
          <div className="mx-auto w-28 h-28 mb-4 relative">
            <div className={`w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center transform transition-all duration-700 ${loading ? 'animate-bounce rotate-12 scale-110' : 'hover:scale-110 hover:rotate-6'}`}>
              <div className="text-white text-3xl">
                {loading ? '' : getRoleIcon(formData.role)}
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
          </div>

          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Join Uni House!
          </h2>
          <p className="mt-2 text-gray-600 text-lg">
            Create your account in seconds
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

          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>👤</span>
                <span>Full Name</span>
              </label>
              <div className="relative group">
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 transform group-hover:scale-105 placeholder-gray-400 text-gray-900 bg-white shadow-sm"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input */}
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
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>📱</span>
                <span>Phone Number (Optional)</span>
              </label>
              <div className="relative group">
                <input
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 transform group-hover:scale-105 placeholder-gray-400 text-gray-900 bg-white shadow-sm"
                  placeholder="07XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>🎯</span>
                <span>I am a</span>
              </label>
              <div className="relative group">
                <select
                  name="role"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 transform group-hover:scale-105 text-gray-900 bg-white shadow-sm appearance-none"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="student">🎓 Student</option>
                  <option value="owner">🏠 Boarding Owner</option>
                  <option value="service">🔧 Service Provider</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
            </div>

            {/* Password Input */}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>✅</span>
                <span>Confirm Password</span>
              </label>
              <div className="relative group">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 transform group-hover:scale-105 placeholder-gray-400 text-gray-900 bg-white shadow-sm pr-12"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className={`text-sm flex items-center space-x-2 ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                  }`}>
                  <span>{formData.password === formData.confirmPassword ? '✅' : '❌'}</span>
                  <span>
                    {formData.password === formData.confirmPassword
                      ? 'Passwords match!'
                      : 'Passwords do not match'
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center items-center space-x-3 py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${loading
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
              }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Creating Your Account...</span>
              </>
            ) : (
              <>
                <span className="transform transition-transform group-hover:scale-110">🎉</span>
                <span>Create Account</span>
              </>
            )}
          </button>

          {/* Progress Bar for Loading */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-300 hover:underline inline-flex items-center space-x-1"
              >
                <span>Sign in here</span>
                <span className="transform transition-transform hover:translate-x-1">➡️</span>
              </Link>
            </p>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-blue-300 rounded-full opacity-50 animate-float"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-purple-300 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-green-300 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
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
  )
}

export default Register