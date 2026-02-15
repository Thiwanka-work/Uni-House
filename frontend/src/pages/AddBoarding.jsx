import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const AddBoarding = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'room',
    university: '',
    town: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    facilities: [],
    contact_phone: user?.phone || ''
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

  React.useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFacilityChange = (facility) => {
    const newFacilities = formData.facilities.includes(facility)
      ? formData.facilities.filter(f => f !== facility)
      : [...formData.facilities, facility]

    setFormData({
      ...formData,
      facilities: newFacilities
    })
  }

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First create the boarding
      const response = await axios.post('/api/boardings.php', formData)
      const boardingId = response.data.data.id

      // Then upload images if any
      if (images.length > 0) {
        const imageFormData = new FormData()
        images.forEach(image => {
          imageFormData.append('images[]', image)
        })
        imageFormData.append('boarding_id', boardingId)

        await axios.post('/api/upload_images.php', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      alert('Boarding added successfully! Now visible to all students.') // ✅ Changed message
      navigate('/dashboard')
    } catch (error) {
      console.error('Error adding boarding:', error)
      alert('Error adding boarding. Please try again.')
    }
    setLoading(false)
  }
  if (!user || user.role !== 'owner') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Boarding</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Cozy Room Near University"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your boarding place..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="room">Room</option>
                <option value="house">House</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University *
              </label>
              <select
                name="university"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.university}
                onChange={handleChange}
              >
                <option value="">Select University</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Town/City *
              </label>
              <select
                name="town"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.town}
                onChange={handleChange}
              >
                <option value="">Select Town/City</option>
                {towns.map(town => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Price (Rs.) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.price}
                onChange={handleChange}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                name="bedrooms"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                name="bathrooms"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contact_phone"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="07XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facilities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {facilityOptions.map(facility => (
                <label key={facility} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can upload multiple images. Maximum 5 images recommended.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adding Boarding...' : 'Add Boarding'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBoarding