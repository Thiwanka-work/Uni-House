import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const SearchBoardings = () => {
  const [boardings, setBoardings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    university: '',
    town: '',
    min_price: '',
    max_price: '',
    type: '',
    facilities: [],
    sort: 'newest'
  })

  const facilityOptions = ['AC', 'WiFi', 'Parking', 'Kitchen', 'Laundry', 'Security']

  const universities = [
    'University of Colombo',
    'University of Peradeniya',
    'University of Sri Jayewardenepura',
    'University of Kelaniya',
    'University of Moratuwa',
    'University of Jaffna',
    'University of Ruhuna',
    'University of Vavuniya',
    'Eastern University',
    'South Eastern University',
    'Rajarata University',
    'Sabaragamuwa University',
    'Wayamba University',
    'Uva Wellassa University',
    'Open University of Sri Lanka',
    'Buddhist and Pali University',
    'University of the Visual & Performing Arts',
    'NSBM Green University',
    'SLIIT (Sri Lanka Institute of Information Technology)',
    'IIT (Informatics Institute of Technology)',
    'BCAS (British College of Applied Studies)',
    'Horizon Campus',
    'APIIT (Asia Pacific Institute of Information Technology)',
    'Colombo International Nautical and Engineering College'
  ]

  const towns = [
    'Colombo', 'Mount Lavinia', 'Dehiwala', 'Moratuwa', 'Ratmalana', 'Nugegoda', 'Maharagama', 'Kotte', 'Battaramulla',
    'Kandy', 'Peradeniya', 'Katugastota', 'Gampola', 'Nawalapitiya',
    'Galle', 'Matara', 'Hambantota', 'Tangalle',
    'Jaffna', 'Chavakachcheri', 'Point Pedro',
    'Batticaloa', 'Kattankudy', 'Eravur',
    'Trincomalee', 'Kinniya',
    'Kurunegala', 'Kuliyapitiya', 'Narammala',
    'Anuradhapura', 'Mihintale', 'Kekirawa',
    'Ratnapura', 'Embilipitiya', 'Balangoda',
    'Badulla', 'Bandarawela', 'Welimada', 'Haputale',
    'Gampaha', 'Negombo', 'Katunayake', 'Wattala', 'Ja-Ela', 'Kelaniya', 'Kadawatha',
    'Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Aluthgama',
    'Nuwara Eliya', 'Hatton', 'Talawakelle',
    'Polonnaruwa', 'Kaduruwela',
    'Ampara', 'Kalmunai', 'Sammanthurai',
    'Puttalam', 'Chilaw', 'Wennappuwa',
    'Kegalle', 'Mawanella', 'Warakapola',
    'Matale', 'Dambulla', 'Galewela',
    'Monaragala', 'Wellawaya', 'Bibile',
    'Vavuniya', 'Mannar', 'Mullaitivu', 'Kilinochchi'
  ].sort()

  useEffect(() => {
    fetchBoardings()
  }, [])

  const fetchBoardings = async (filterParams = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.keys(filterParams).forEach(key => {
        if (filterParams[key]) {
          params.append(key, filterParams[key])
        }
      })

      const response = await axios.get(`/api/boardings.php?${params}`)
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

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleFacilityChange = (facility) => {
    const newFacilities = filters.facilities.includes(facility)
      ? filters.facilities.filter(f => f !== facility)
      : [...filters.facilities, facility]

    setFilters({ ...filters, facilities: newFacilities })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const filterParams = {
      ...filters,
      facilities: filters.facilities.join(',')
    }
    fetchBoardings(filterParams)
  }

  const clearFilters = () => {
    const defaultFilters = {
      university: '',
      town: '',
      min_price: '',
      max_price: '',
      type: '',
      facilities: [],
      sort: 'newest'
    }
    setFilters(defaultFilters)
    fetchBoardings(defaultFilters)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filters.university}
                  onChange={(e) => handleFilterChange('university', e.target.value)}
                >
                  <option value="">All Universities</option>
                  {universities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Town
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filters.town}
                  onChange={(e) => handleFilterChange('town', e.target.value)}
                >
                  <option value="">All Towns</option>
                  {towns.map(town => (
                    <option key={town} value={town}>{town}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="room">Room</option>
                  <option value="house">House</option>
                  <option value="shared">Shared</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facilities
                </label>
                <div className="space-y-2">
                  {facilityOptions.map(facility => (
                    <label key={facility} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.facilities.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Boardings</h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading boardings...</p>
            </div>
          ) : boardings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No boardings found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {boardings.map(boarding => (
                <div key={boarding.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {boarding.images && boarding.images.length > 0 ? (
                    <img
                      src={`/uploads/${boarding.images[0]}`}
                      alt={boarding.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">🏠 No Image</span>
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {boarding.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{boarding.town}, near {boarding.university}</p>
                    <p className="text-blue-600 font-bold text-lg mb-2">Rs. {boarding.price}/month</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{boarding.type}</span>
                      <span>{boarding.bedrooms} bed • {boarding.bathrooms} bath</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {boarding.facilities && JSON.parse(boarding.facilities).map((facility, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-900 text-xs px-2 py-1 rounded border border-blue-100"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/boarding/${boarding.id}`}
                      className="block w-full bg-blue-900 text-white text-center py-2 rounded hover:bg-blue-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBoardings