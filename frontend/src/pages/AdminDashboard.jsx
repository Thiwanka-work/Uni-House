import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import Footer from '../components/Footer'

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [boardings, setBoardings] = useState([])
  const [users, setUsers] = useState([])
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    students: 0,
    owners: 0,
    servicers: 0,
    total: 0,
    boardings: 0
  })

  useEffect(() => {
    console.log('AdminDashboard mounted, user:', user)
    if (!user || user.role !== 'admin') {
      console.log('Not admin, redirecting to login')
      navigate('/login')
      return
    }
    loadAllData()
  }, [user, navigate, userSearchQuery, userRoleFilter])

  const loadAllData = async () => {
    console.log('Loading admin data...')
    setLoading(true)
    setError(null)
    try {
      // Fetch users with search and filter
      console.log('Fetching users with search and filter...')
      const usersResponse = await axios.get(`/api/users.php?search=${userSearchQuery}&role=${userRoleFilter}`)
      console.log('Users response:', usersResponse.data)
      const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : []
      setUsers(usersData)

      // Calculate user stats
      const students = usersData.filter(u => u.role === 'student').length
      const owners = usersData.filter(u => u.role === 'owner').length
      const servicers = usersData.filter(u => u.role === 'service').length

      // Fetch boardings with new response format handling
      console.log('Fetching boardings...')
      const boardingsResponse = await axios.get('/api/boardings.php?all=true')
      console.log('Boardings response:', boardingsResponse.data)

      // Handle both old and new response formats
      let boardingsData = []
      if (boardingsResponse.data.success !== undefined) {
        // New standardized format
        boardingsData = Array.isArray(boardingsResponse.data.data) ? boardingsResponse.data.data : []
      } else {
        // Old format (direct array)
        boardingsData = Array.isArray(boardingsResponse.data) ? boardingsResponse.data : []
      }

      setBoardings(boardingsData)

      // Set all stats
      setStats({
        students,
        owners,
        servicers,
        total: usersData.length,
        boardings: boardingsData.length
      })

      console.log('Data loaded successfully')
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.response?.data?.message || error.message || 'Failed to load data')
      setLoading(false)
    }
  }

  const deleteBoarding = async (id) => {
    if (!window.confirm('Are you sure you want to delete this boarding?')) {
      return
    }

    try {
      await axios.delete(`/api/boardings.php?id=${id}`)
      setBoardings(boardings.filter(b => b.id !== id))
      alert('Boarding deleted successfully!')
    } catch (error) {
      console.error('Error deleting boarding:', error)
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await axios.delete(`/api/users.php?id=${id}`)
      const updatedUsers = users.filter(u => u.id !== id)
      setUsers(updatedUsers)
      // Recalculate stats
      const students = updatedUsers.filter(u => u.role === 'student').length
      const owners = updatedUsers.filter(u => u.role === 'owner').length
      const servicers = updatedUsers.filter(u => u.role === 'service').length
      setStats({
        students,
        owners,
        servicers,
        total: updatedUsers.length
      })
      alert('User deleted successfully!')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user. Please try again.')
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800'
      case 'owner': return 'bg-green-100 text-green-800'
      case 'service': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Access Denied</p>
          <p className="text-gray-600">You must be an admin to access this page.</p>
        </div>
      </div>
    )
  }

  // Show error message if data failed to load
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl font-bold mb-2">Error Loading Dashboard</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAllData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and boardings</p>
        </div>

        {/* Stats Cards - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Students</p>
                <p className="text-4xl font-bold mt-2">{stats.students}</p>
              </div>
              <span className="text-5xl opacity-80">👨‍🎓</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Owners</p>
                <p className="text-4xl font-bold mt-2">{stats.owners}</p>
              </div>
              <span className="text-5xl opacity-80">🏠</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Service Providers</p>
                <p className="text-4xl font-bold mt-2">{stats.servicers}</p>
              </div>
              <span className="text-5xl opacity-80">🛠️</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <span className="text-5xl opacity-80">👥</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Boardings</p>
                <p className="text-4xl font-bold mt-2">{stats.boardings}</p>
              </div>
              <span className="text-5xl opacity-80">🏘️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                👥 Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('boardings')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'boardings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                🏠 All Boardings ({boardings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'users' && (
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                      <h2 className="text-xl font-semibold">
                        All Registered Users ({users.length})
                      </h2>
                      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search name or email..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                          />
                          <span className="absolute left-3 top-2.5 text-gray-400 font-bold">🔍</span>
                        </div>
                        {/* Role Filter */}
                        <select
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                          value={userRoleFilter}
                          onChange={(e) => setUserRoleFilter(e.target.value)}
                        >
                          <option value="">All Roles</option>
                          <option value="student">Students</option>
                          <option value="owner">Owners</option>
                          <option value="service">Services</option>
                          <option value="admin">Admins</option>
                        </select>
                      </div>
                    </div>

                    {users.length === 0 ? (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-700">No users match your criteria</h3>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(userItem => (
                              <tr key={userItem.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{userItem.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(userItem.role)}`}>
                                    {userItem.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {userItem.phone || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(userItem.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {userItem.role !== 'admin' && (
                                    <button
                                      onClick={() => deleteUser(userItem.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      🗑️ Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'boardings' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      All Boardings ({boardings.length})
                    </h2>

                    {boardings.length === 0 ? (
                      <p className="text-gray-600 py-4">No boardings found.</p>
                    ) : (
                      <div className="space-y-4">
                        {boardings.map(boarding => (
                          <div key={boarding.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{boarding.title}</h3>
                                <p className="text-gray-600">{boarding.town}, near {boarding.university}</p>
                                <p className="text-green-600 font-semibold">Rs. {boarding.price}/month</p>
                                <p className="text-sm text-gray-500 capitalize">
                                  {boarding.type} • {boarding.bedrooms} bed • {boarding.bathrooms} bath
                                </p>
                                <p className="text-sm text-gray-500">Contact: {boarding.contact_phone}</p>
                                <p className="text-xs text-gray-400">
                                  Added: {new Date(boarding.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <button
                                  onClick={() => deleteBoarding(boarding.id)}
                                  className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminDashboard
