import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Phone, Target, GraduationCap, Home as HomeIcon, Wrench, Lock, Eye, EyeOff, CheckCircle2, XCircle, Rocket, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react'

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
    if (passwordStrength < 50) return 'bg-rose-500'
    if (passwordStrength < 75) return 'bg-amber-500'
    return 'bg-emerald-500'
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
      case 'student': return <GraduationCap className="text-white w-12 h-12" />
      case 'owner': return <HomeIcon className="text-white w-12 h-12" />
      case 'service': return <Wrench className="text-white w-12 h-12" />
      default: return <User className="text-white w-12 h-12" />
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed relative py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url('/register-bg.png')`
      }}
    >
      <div className={`max-w-xl w-full space-y-8 transition-all duration-500 glass-card p-10 rounded-[2.5rem] shadow-2xl ${shake ? 'animate-shake' : ''}`}>

        {/* Animated Header */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 mb-6 relative">
            <div className={`w-full h-full bg-gradient-to-br from-emerald-400 to-sky-500 rounded-3xl flex items-center justify-center shadow-lg transform transition-all duration-700 ${loading ? 'animate-pulse scale-110' : 'hover:scale-110 hover:rotate-6'}`}>
              {loading ? <Loader2 className="text-white w-10 h-10 animate-spin" /> : getRoleIcon(formData.role)}
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-800">
            Join Uni House!
          </h2>
          <p className="mt-3 text-slate-600 text-lg font-medium">
            Create your account in seconds
          </p>
        </div>

        {/* Animated Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center space-x-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Full Name</span>
                </label>
                <div className="relative group">
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-5 py-3 border-2 border-transparent bg-slate-50/60 rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all duration-300 placeholder-slate-400 text-slate-800 shadow-inner group-hover:bg-white"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>Email Address</span>
                </label>
                <div className="relative group">
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-5 py-3 border-2 border-transparent bg-slate-50/60 rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all duration-300 placeholder-slate-400 text-slate-800 shadow-inner group-hover:bg-white"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>Phone Number</span>
                </label>
                <div className="relative group">
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-5 py-3 border-2 border-transparent bg-slate-50/60 rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all duration-300 placeholder-slate-400 text-slate-800 shadow-inner group-hover:bg-white"
                    placeholder="07XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-slate-500" />
                  <span>I am a</span>
                </label>
                <div className="relative group">
                  <select
                    name="role"
                    required
                    className="w-full px-5 py-3 border-2 border-transparent bg-slate-50/60 rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all duration-300 text-slate-800 shadow-inner appearance-none group-hover:bg-white"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="student">Student</option>
                    <option value="owner">Boarding Owner</option>
                    <option value="service">Service Provider</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Password</span>
                </label>
                <div className="relative group">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-5 py-3 border-2 border-transparent bg-slate-50/60 rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all duration-300 placeholder-slate-400 text-slate-800 shadow-inner group-hover:bg-white pr-12"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="text-slate-400 hover:text-sky-500 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative group">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="w-full px-5 py-3 border-2 border-transparent bg-slate-50/60 rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all duration-300 placeholder-slate-400 text-slate-800 shadow-inner group-hover:bg-white pr-12"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="text-slate-400 hover:text-sky-500 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className={`text-xs font-medium flex items-center space-x-1 mt-1 ${formData.password === formData.confirmPassword ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                    {formData.password === formData.confirmPassword ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>
                      {formData.password === formData.confirmPassword
                        ? 'Passwords match'
                        : 'Passwords do not match'
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center items-center space-x-2 py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white transition-all duration-500 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-sky-200 mt-6 ${loading
              ? 'bg-slate-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-emerald-500 to-sky-500 shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-emerald-200'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span>Create Account</span>
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-slate-600 font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-sky-500 hover:text-emerald-500 transition-colors duration-300 inline-flex items-center space-x-1 group"
              >
                <span>Sign in here</span>
                <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default Register