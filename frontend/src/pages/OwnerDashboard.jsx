import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const OwnerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [boardings, setBoardings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total_boardings: 0,
    total_rooms: 0,
    total_income: 0,
    total_bathrooms: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login')
      return
    }
    fetchBoardings()
    fetchStats()
  }, [user, navigate])

  const fetchBoardings = async () => {
    try {
      const response = await axios.get(`/api/boardings.php?owner_id=${user.id}`)
      // Handle both old and new response formats
      const boardingsData = response.data.success !== undefined 
        ? (response.data.data || []) 
        : response.data
      setBoardings(boardingsData)
    } catch (error) {
      console.error('Error fetching boardings:', error)
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/api/boardings.php?stats=true&owner_id=${user.id}`)
      // Handle both old and new response formats
      const statsData = response.data.success !== undefined 
        ? response.data.data 
        : response.data
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const deleteBoarding = async (id) => {
    if (!window.confirm('Are you sure you want to delete this boarding?')) {
      return
    }

    try {
      await axios.delete(`/api/boardings.php?id=${id}`)
      setBoardings(boardings.filter(b => b.id !== id))
      fetchStats() // Refresh statistics after deletion
      alert('Boarding deleted successfully!')
    } catch (error) {
      console.error('Error deleting boarding:', error)
      alert('Error deleting boarding. Please try again.')
    }
  }

  if (!user || user.role !== 'owner') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Boardings</p>
              <p className="text-3xl font-bold">{stats.total_boardings}</p>
            </div>
            <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Rooms</p>
              <p className="text-3xl font-bold">{stats.total_rooms}</p>
            </div>
            <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Potential Income</p>
              <p className="text-3xl font-bold">Rs. {stats.total_income.toLocaleString()}</p>
              <p className="text-purple-100 text-xs mt-1">per month</p>
            </div>
            <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Total Bathrooms</p>
              <p className="text-3xl font-bold">{stats.total_bathrooms}</p>
            </div>
            <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Boardings</h1>
        <Link
          to="/add-boarding"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Boarding
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your boardings...</p>
        </div>
      ) : boardings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">You haven't added any boardings yet.</p>
          <Link
            to="/add-boarding"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Boarding
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {boardings.map(boarding => (
            <div key={boarding.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {boarding.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {boarding.town}, near {boarding.university}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                        {boarding.type}
                      </span>
                      <span>{boarding.bedrooms} bed • {boarding.bathrooms} bath</span>
                      <span className="text-green-600 font-semibold">
                        Rs. {boarding.price}/month
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {boarding.facilities && JSON.parse(boarding.facilities).map((facility, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>

                    {/* Added missing date info */}
                    <div className="text-gray-500 text-sm">
                      Created: {new Date(boarding.created_at).toLocaleDateString()}
                    </div>
                  </div> {/* Missing closing div added */}

                  <div className="flex space-x-2 ml-4">
                    <Link
                      to={`/edit-boarding/${boarding.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteBoarding(boarding.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard