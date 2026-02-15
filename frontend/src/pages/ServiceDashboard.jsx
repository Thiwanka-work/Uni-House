import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const ServiceDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'service') {
      navigate('/login')
      return
    }
    fetchServices()
  }, [user, navigate])

  const fetchServices = async () => {
    try {
      const response = await axios.get(`/api/services.php?provider_id=${user.id}`)
      setServices(response.data.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
    setLoading(false)
  }

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      await axios.delete(`/api/services.php?id=${id}`)
      setServices(services.filter(s => s.id !== id))
      alert('Service deleted successfully!')
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting service. Please try again.')
    }
  }

  if (!user || user.role !== 'service') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Services</h1>
        <Link
          to="/add-service"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Service
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">You haven't added any services yet.</p>
          <Link
            to="/add-service"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-6 flex-1">
                    {service.image ? (
                      <img
                        src={`/uploads/${service.image}`}
                        alt={service.name}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-blue-50 rounded-lg flex items-center justify-center text-3xl">
                        🛠️
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 mb-2 capitalize">
                        {service.service_type} • {service.town}, near {service.university}
                      </p>
                      <p className="text-gray-700 mb-3">{service.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📞 {service.contact_number}</span>
                        <span>📅 {new Date(service.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Link
                      to={`/edit-service/${service.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteService(service.id)}
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

export default ServiceDashboard