import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

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
      // Handle both old and new response formats
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading boarding details...</p>
        </div>
      </div>
    )
  }

  if (!boarding) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Boarding not found</h1>
          <Link to="/search" className="text-blue-600 hover:text-blue-800">
            Back to search
          </Link>
        </div>
      </div>
    )
  }

  const facilities = boarding.facilities ? JSON.parse(boarding.facilities) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Images */}
        <div className="relative">
          {boarding.images && boarding.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-2">
                <img
                  src={`/uploads/${boarding.images[0]}`}
                  alt={boarding.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#666" font-size="16" font-family="Arial">No Image Available</text></svg>')}`;
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {boarding.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={`/uploads/${image}`}
                    alt={boarding.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#666" font-size="12" font-family="Arial">No Image</text></svg>')}`;
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Images Available</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{boarding.title}</h1>
              <p className="text-gray-600 text-lg">
                {boarding.town}, near {boarding.university}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">Rs. {boarding.price}/month</p>
              {user && user.role === 'student' && (
                <button
                  onClick={toggleFavorite}
                  className={`mt-2 px-4 py-2 rounded ${isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{boarding.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold capitalize">{boarding.type}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{boarding.bedrooms}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{boarding.bathrooms}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">University</p>
                    <p className="font-semibold">{boarding.university}</p>
                  </div>
                </div>
              </div>

              {facilities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Facilities</h2>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span> {boarding.contact_phone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Location:</span> {boarding.town}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Near:</span> {boarding.university}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Contact the owner directly for viewing appointments
                    and more details about the boarding place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardingDetails