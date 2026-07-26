import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, AlertTriangle, Mail, Lock, Eye, EyeOff, LogIn, Loader2, ArrowRight } from 'lucide-react'

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

    // Add loading animation when submitting
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed relative py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url('/login-bg.png')` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 180, damping: 20 }}
          className={`max-w-md w-full space-y-8 glass-card p-10 rounded-[2.5rem] shadow-2xl ${shake ? 'animate-shake' : ''}`}
        >
          {/* Animated Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="mx-auto w-20 h-20 mb-6 relative"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 6 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-full h-full bg-gradient-to-br from-indigo-500 to-sky-500 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200"
              >
                {loading ? <Loader2 className="text-white w-10 h-10 animate-spin" /> : <Key className="text-white w-10 h-10" />}
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl font-extrabold text-slate-800"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-slate-500 text-base font-medium"
            >
              Sign in to your Uni House account
            </motion.p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center space-x-3 shadow-sm"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-5 py-4 border-2 border-transparent bg-slate-50/80 rounded-2xl focus:outline-none focus:border-indigo-400 focus:bg-white transition-all duration-300 placeholder-slate-400 text-slate-800"
                placeholder="name@university.edu"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-5 py-4 border-2 border-transparent bg-slate-50/80 rounded-2xl focus:outline-none focus:border-indigo-400 focus:bg-white transition-all duration-300 placeholder-slate-400 text-slate-800 pr-14"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <motion.button
                  type="button"
                  onClick={togglePasswordVisibility}
                  whileTap={{ scale: 0.85 }}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.03, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.97 } : {}}
                className={`w-full flex justify-center items-center space-x-2 py-4 px-4 text-lg font-bold rounded-2xl text-white transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
                  loading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-sky-500 shadow-lg shadow-indigo-200'
                }`}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing In...</span></>
                ) : (
                  <><LogIn className="w-5 h-5" /><span>Sign In</span></>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-center pt-1"
            >
              <p className="text-slate-600 font-medium text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-indigo-600 hover:text-sky-500 transition-colors inline-flex items-center gap-1 group">
                  <span>Sign up now</span>
                  <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>

        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>
      </motion.div>
      <Footer />
    </>
  )
}

export default Login