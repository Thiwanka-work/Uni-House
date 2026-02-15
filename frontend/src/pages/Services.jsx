import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const Services = () => {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    university: '',
    town: '',
    serviceType: ''
  })

  // Sri Lankan Universities List (Updated with Vavuniya and Private Universities)
  const sriLankanUniversities = [
    // National Universities
    'University of Colombo',
    'University of Moratuwa',
    'University of Kelaniya',
    'University of Sri Jayewardenepura',
    'University of Peradeniya',
    'University of Ruhuna',
    'University of Jaffna',
    'University of Sabaragamuwa',
    'Eastern University, Sri Lanka',
    'South Eastern University of Sri Lanka',
    'Rajarata University of Sri Lanka',
    'Wayamba University of Sri Lanka',
    'Uva Wellassa University of Sri Lanka',
    'Open University of Sri Lanka',

    // Campus and Other Universities
    'University of Vavuniya',
    'Sri Palee Campus',
    'Gampaha Wickramarachchi University',

    // Private Universities and Institutes
    'NSBM Green University',
    'SLIIT (Sri Lanka Institute of Information Technology)',
    'IIT (Informatics Institute of Technology)',
    'CINEC Campus',
    'ICBT Campus',
    'ACBT Campus',
    'ANC Education',
    'Imperial Institute of Higher Education',
    'British College of Applied Studies',
    'American College of Higher Education',
    'Australian College of Business & Technology',
    'London College of Legal Studies',
    'Management & Science University',
    'Horizon Campus',
    'International College of Business & Technology',
    'Sri Lanka Technological Campus',
    'Other University'
  ]

  // Common Towns in Sri Lanka (Updated)
  const commonTowns = [
    'Colombo', 'Moratuwa', 'Dehiwala', 'Mount Lavinia', 'Negombo', 'Gampaha', 'Kadawatha', 'Kiribathgoda',
    'Kandy', 'Peradeniya', 'Katugastota', 'Gampola', 'Kundasale',
    'Galle', 'Matara', 'Hikkaduwa', 'Ambalangoda', 'Weligama',
    'Jaffna', 'Vavuniya', 'Kilinochchi', 'Mannar', 'Point Pedro',
    'Trincomalee', 'Batticaloa', 'Kalmunai', 'Ampara', 'Akkaraipattu',
    'Anuradhapura', 'Polonnaruwa', 'Dambulla', 'Sigiriya', 'Habarana',
    'Badulla', 'Bandarawela', 'Nuwara Eliya', 'Welimada', 'Haputale',
    'Kurunegala', 'Puttalam', 'Chilaw', 'Kuliyapitiya', 'Narammala',
    'Ratnapura', 'Kegalle', 'Avissawella', 'Balangoda', 'Embilipitiya',
    'Matale', 'Dankotuwa', 'Wennappuwa', 'Seeduwa', 'Katunayake',
    'Other Town'
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services.php')
      setServices(response.data.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
    setLoading(false)
  }

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    })
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.service_type.toLowerCase().includes(filters.search.toLowerCase()) ||
      service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      service.description.toLowerCase().includes(filters.search.toLowerCase())

    const matchesUniversity = !filters.university ||
      service.university === filters.university ||
      (filters.university === 'Other University' &&
        !sriLankanUniversities.includes(service.university))

    const matchesTown = !filters.town ||
      service.town === filters.town ||
      (filters.town === 'Other Town' &&
        !commonTowns.includes(service.town))

    const matchesServiceType = !filters.serviceType ||
      service.service_type === filters.serviceType

    return matchesSearch && matchesUniversity && matchesTown && matchesServiceType
  })

  const serviceTypes = [...new Set(services.map(service => service.service_type))]

  const clearFilters = () => {
    setFilters({
      search: '',
      university: '',
      town: '',
      serviceType: ''
    })
  }

  const hasActiveFilters = filters.search || filters.university || filters.town || filters.serviceType

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Find Service Providers</h1>
          <p className="text-gray-600 mt-2">Discover trusted services near your university</p>
        </div>
        {user && user.role === 'service' && (
          <Link
            to="/add-service"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ➕ Add Service
          </Link>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search Services
            </label>
            <input
              type="text"
              placeholder="Search by name, type, description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* University Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎓 University Area
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              value={filters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
            >
              <option value="">All Universities</option>
              <optgroup label="National Universities">
                {sriLankanUniversities.filter(uni => !uni.includes('Campus') && !uni.includes('Private')).map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </optgroup>
              <optgroup label="Private Universities & Campuses">
                {sriLankanUniversities.filter(uni => uni.includes('Campus') || uni.includes('Private') || uni.includes('NSBM') || uni.includes('SLIIT') || uni.includes('IIT')).map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </optgroup>
              <option value="Other University">Other University</option>
            </select>
          </div>

          {/* Town Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏙️ Town/City
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              value={filters.town}
              onChange={(e) => handleFilterChange('town', e.target.value)}
            >
              <option value="">All Towns</option>
              <optgroup label="Major Cities">
                {commonTowns.slice(0, 15).map(town => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </optgroup>
              <optgroup label="Other Towns">
                {commonTowns.slice(15).map(town => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </optgroup>
              <option value="Other Town">Other Town</option>
            </select>
          </div>

          {/* Service Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🛠️ Service Type
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              value={filters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            >
              <option value="">All Services</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters and Clear Button */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Search: {filters.search}
                </span>
              )}
              {filters.university && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  🎓 {filters.university}
                </span>
              )}
              {filters.town && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  🏙️ {filters.town}
                </span>
              )}
              {filters.serviceType && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  🛠️ {filters.serviceType}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1 transition-colors duration-300"
            >
              <span>🗑️</span>
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Found <span className="font-bold text-blue-600">{filteredServices.length}</span> services
          {hasActiveFilters && ' matching your filters'}
        </p>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
          <p className="text-gray-600 mb-6">
            {hasActiveFilters
              ? 'Try adjusting your filters to find more services.'
              : 'No services available at the moment.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              {service.image ? (
                <img
                  src={`/uploads/${service.image}`}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-4xl">🛠️</span>
                </div>
              )}

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize font-medium">
                    {service.service_type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-lg">📞</span>
                    <span className="font-medium">{service.contact_number}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-lg">🎓</span>
                    <span>Near {service.university}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-lg">🏙️</span>
                    <span>{service.town}</span>
                  </div>
                  {service.provider_name && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span className="text-lg">👤</span>
                      <span>By {service.provider_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Services