import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import ChatWidget from '../components/ChatWidget'
import {
  CheckCircle2, XCircle, Heart, MapPin, Phone, Building2,
  BedDouble, Bath, GraduationCap, ArrowLeft, Loader2
} from 'lucide-react'

const BoardingDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [boarding, setBoarding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchBoarding()
    checkFavorite()
  }, [id])

  const fetchBoarding = async () => {
    try {
      const response = await axios.get(`/api/boardings.php?id=${id}`)
      const boardingData = response.data.success !== undefined
        ? response.data.data
        : response.data
      setBoarding(boardingData)
    } catch (error) {
      console.error('Error fetching boarding:', error)
    }
    setLoading(false)
  }

  const checkFavorite = async () => {
    if (!user) return
    try {
      const response = await axios.get('/api/favorites.php')
      const favorites = response.data
      setIsFavorite(favorites.some(fav => fav.id === parseInt(id)))
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login to add favorites')
      return
    }
    try {
      if (isFavorite) {
        await axios.delete(`/api/favorites.php?boarding_id=${id}`)
        setIsFavorite(false)
      } else {
        await axios.post('/api/favorites.php', { boarding_id: id })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading boarding details...</p>
        </div>
      </div>
    )
  }

  if (!boarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Boarding not found</h1>
          <Link to="/search" className="text-indigo-600 hover:text-sky-500 font-semibold flex items-center gap-1 justify-center">
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>
        </div>
      </div>
    )
  }

  const facilities = boarding.facilities ? JSON.parse(boarding.facilities) : []
  const isAvailable = boarding.is_available === undefined || boarding.is_available === null
    ? true
    : Boolean(Number(boarding.is_available))

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">

        {/* Back link */}
        <Link to="/search" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-medium text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
          {/* Images */}
          <div className="relative">
            {boarding.images && boarding.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                <div className="md:col-span-2">
                  <img
                    src={`/uploads/${boarding.images[0]}`}
                    alt={boarding.title}
                    className="w-full h-72 md:h-[420px] object-cover"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f1f5f9"/><text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-size="16" font-family="Arial">No Image</text></svg>')}`
                    }}
                  />
                </div>
                <div className="grid grid-rows-2 gap-1">
                  {boarding.images.slice(1, 3).map((image, index) => (
                    <img
                      key={index}
                      src={`/uploads/${image}`}
                      alt={boarding.title}
                      className="w-full h-36 md:h-[209px] object-cover"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f1f5f9"/><text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">No Image</text></svg>')}`
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-slate-100 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-slate-300" />
              </div>
            )}

            {/* Availability Badge overlay */}
            <div className="absolute top-4 left-4">
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-sm font-bold rounded-full shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white text-sm font-bold rounded-full shadow-lg">
                  <XCircle className="w-4 h-4" />
                  Full
                </span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 mb-2">{boarding.title}</h1>
                <p className="text-slate-500 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {boarding.town}, near {boarding.university}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <p className="text-3xl font-extrabold text-indigo-600">
                  Rs. {Number(boarding.price).toLocaleString()}
                  <span className="text-base text-slate-400 font-medium">/month</span>
                </p>
                {user && user.role === 'student' && (
                  <motion.button
                    onClick={toggleFavorite}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isFavorite
                        ? 'bg-rose-50 text-rose-500 border border-rose-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-rose-200 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
                  </motion.button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {/* Left: Description + Details + Facilities */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-3">Description</h2>
                  <p className="text-slate-600 leading-relaxed">{boarding.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Property Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Building2, label: 'Type', value: boarding.type, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { icon: BedDouble, label: 'Bedrooms', value: boarding.bedrooms, color: 'text-sky-600', bg: 'bg-sky-50' },
                      { icon: Bath, label: 'Bathrooms', value: boarding.bathrooms, color: 'text-violet-600', bg: 'bg-violet-50' },
                      { icon: GraduationCap, label: 'University', value: boarding.university.split(' ').slice(0, 2).join(' '), color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                      <div key={label} className={`${bg} text-center p-4 rounded-2xl`}>
                        <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                        <p className="text-xs text-slate-500 mb-1">{label}</p>
                        <p className="font-bold text-slate-800 capitalize text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {facilities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Facilities</h2>
                    <div className="flex flex-wrap gap-2">
                      {facilities.map((facility, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full text-sm font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Contact + Availability */}
              <div className="md:col-span-1">
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl sticky top-4 space-y-5">
                  <h3 className="text-lg font-bold text-slate-800">Contact Information</h3>

                  {/* Availability status */}
                  <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                    isAvailable ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'
                  }`}>
                    {isAvailable
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      : <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    }
                    <div>
                      <p className={`font-bold text-sm ${isAvailable ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isAvailable ? 'Available Now' : 'Currently Full'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isAvailable ? 'Rooms are available for booking' : 'No rooms available at this time'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                        <p className="font-semibold text-slate-800">{boarding.contact_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Location</p>
                        <p className="font-semibold text-slate-800">{boarding.town}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-slate-600">
                      <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Near University</p>
                        <p className="font-semibold text-slate-800">{boarding.university}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <strong>Tip:</strong> Contact the owner directly or use the chat below for viewing appointments and details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget — students only, shows owner's ID from boarding data */}
      {user?.role === 'student' && boarding?.owner_id && (
        <ChatWidget
          boardingId={Number(id)}
          ownerId={Number(boarding.owner_id)}
          ownerName={boarding.owner_name || 'Owner'}
        />
      )}
    </div>
  )
}

export default BoardingDetails