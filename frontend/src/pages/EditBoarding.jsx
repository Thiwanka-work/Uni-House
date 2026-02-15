import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const EditBoarding = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])

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
    contact_phone: ''
  })

  const facilityOptions = ['AC', 'WiFi', 'Parking', 'Kitchen', 'Laundry', 'Security']

  useEffect(() => {
    fetchBoarding()
  }, [id])

  const fetchBoarding = async () => {
    try {
      const response = await axios.get(`/api/boardings.php?id=${id}`)
      // Handle both old and new response formats
      const boarding = response.data.success !== undefined
        ? response.data.data
        : response.data

      setFormData({
        title: boarding.title,
        description: boarding.description,
        type: boarding.type,
        university: boarding.university,
        town: boarding.town,
        price: boarding.price,
        bedrooms: boarding.bedrooms,
        bathrooms: boarding.bathrooms,
        facilities: boarding.facilities ? JSON.parse(boarding.facilities) : [],
        contact_phone: boarding.contact_phone
      })

      // Store existing images
      if (boarding.images && boarding.images.length > 0) {
        setExistingImages(boarding.images)
      }
    } catch (error) {
      console.error('Error fetching boarding:', error)
      alert('Error loading boarding details')
    }
    setLoading(false)
  }

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
    setSaving(true)

    try {
      // Update boarding details
      await axios.put('/api/boardings.php', { ...formData, id })

      // Upload new images if any
      if (images.length > 0) {
        const imageFormData = new FormData()
        images.forEach(image => {
          imageFormData.append('images[]', image)
        })
        imageFormData.append('boarding_id', id)

        await axios.post('/api/upload_images.php', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      alert('Boarding updated successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error updating boarding:', error)
      alert('Error updating boarding. Please try again.')
    }
    setSaving(false)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Boarding</h1>

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
              <input
                type="text"
                name="university"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.university}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Town/City *
              </label>
              <input
                type="text"
                name="town"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.town}
                onChange={handleChange}
              />
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
              Update Images (Optional)
            </label>
            {existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Current Images: {existingImages.length}</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img, index) => (
                    <img
                      key={index}
                      src={`/uploads/${img}`}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#666" font-size="10" font-family="Arial">No Image</text></svg>')}`;
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload new images to add to existing ones. Maximum 5 images recommended.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Boarding'}
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

export default EditBoarding