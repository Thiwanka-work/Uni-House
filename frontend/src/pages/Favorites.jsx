import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const Favorites = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchFavorites()
  }, [user, navigate])

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/favorites.php')
      setFavorites(response.data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
    setLoading(false)
  }

  const removeFavorite = async (boardingId) => {
    try {
      await axios.delete(`/api/favorites.php?boarding_id=${boardingId}`)
      setFavorites(favorites.filter(fav => fav.id !== boardingId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Favorite Boardings</h1>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">You haven't added any favorites yet.</p>
          <Link
            to="/search"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Boardings
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {favorites.map(boarding => (
            <div key={boarding.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {boarding.images && boarding.images.length > 0 ? (
                <img
                  src={`/uploads/${boarding.images[0]}`}
                  alt={boarding.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#666" font-size="16" font-family="Arial">No Image Available</text></svg>')}`;
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {boarding.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{boarding.town}, near {boarding.university}</p>
                <p className="text-blue-600 font-bold text-lg mb-2">Rs. {boarding.price}/month</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="capitalize">{boarding.type}</span>
                  <span>{boarding.bedrooms} bed • {boarding.bathrooms} bath</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {boarding.facilities && JSON.parse(boarding.facilities).map((facility, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {facility}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/boarding/${boarding.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => removeFavorite(boarding.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites