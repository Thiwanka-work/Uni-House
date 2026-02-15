import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin')
      return
    }
    setIsVisible(true)
  }, [user, navigate])

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/landing-bg.png')`
      }}
    >
      {/* Hero Section with Animations */}
      <div className="container mx-auto px-4 py-12">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>

          {/* Animated Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 border border-yellow-400/30">
                <img
                  src="/logo.png"
                  alt="Uni House Logo"
                  className="h-20 w-20 object-contain filter drop-shadow-lg"
                />
              </div>
              {/* Floating Animation */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Main Heading with Stagger Animation */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
              <span className="bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">
                Find Your Perfect
              </span>
              <br />
              <span className="text-gray-800">Student Home</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover comfortable and affordable boarding places
              <span className="text-blue-600 font-semibold"> near your university</span>
            </p>
          </div>

          {/* Animated CTA Button - Always Visible */}
          <div className="mt-8">
            <Link
              to="/search"
              className="inline-block bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-800 hover:to-blue-700 animate-bounce hover:animate-none border border-yellow-400/20"
            >
              🏠 Browse Boardings
            </Link>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-300 rounded-full opacity-50 animate-float"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-purple-300 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-green-300 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Features Grid with Stagger Animation - Always Visible */}
        <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎓</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">For Students</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Find boarding places with smart filters for university, price range, and essential facilities.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Filter by university and location
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Search by price range
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Filter by room type and facilities
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Save favorite listings
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100 group delay-150">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🏠</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">For Owners</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              List your boarding places and reach thousands of students looking for accommodation.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Easy listing management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Multiple image uploads
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Dashboard for your listings
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Direct contact with students
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-green-100 group delay-300">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔧</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Service Providers</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Offer your services to boarding owners and students in need of maintenance and support.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                List various services
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Reach targeted audience
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Plumbing, electrical, cleaning
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                And much more...
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section with Animation - Only show if user is NOT logged in */}
        {!user && (
          <div className={`text-center bg-gradient-to-r from-blue-900 to-blue-800 p-8 rounded-2xl shadow-xl transition-all duration-1000 delay-500 transform border border-yellow-400/20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <h2 className="text-2xl font-semibold text-white mb-4">Join Our Platform Today</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Register now as a student, boarding owner, or service provider
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 inline-block"
              >
                🔑 Login
              </Link>
            </div>
          </div>
        )}

        {/* Additional Features Section - Visible to all users */}
        <div className={`mt-16 transition-all duration-1000 delay-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Search', desc: 'Find boardings near your university', icon: '🔍' },
              { step: '2', title: 'Compare', desc: 'View prices, facilities & locations', icon: '📊' },
              { step: '3', title: 'Contact', desc: 'Get in touch with boarding owners', icon: '💬' },
              { step: '4', title: 'Move In', desc: 'Find your perfect student home', icon: '🏠' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 border-2 border-blue-200">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section - Always Visible */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Boardings' },
              { number: '50+', label: 'Universities' },
              { number: '1000+', label: 'Students' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div
                key={index}
                className="transform hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home