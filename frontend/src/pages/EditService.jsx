import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const EditService = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [image, setImage] = useState(null)
  const [currentImage, setCurrentImage] = useState('')

  const [formData, setFormData] = useState({
    service_type: '',
    university: '',
    town: '',
    name: '',
    contact_number: '',
    description: ''
  })

  const serviceTypes = ['Plumber', 'Electrician', 'Carpenter', 'Cleaning', 'Painter', 'AC Repair', 'Security', 'Internet Service', 'Water Supply', 'Other']
  const universities = [
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
    'University of Vavuniya',
    'Sri Palee Campus',
    'Gampaha Wickramarachchi University of Indigenous Medicine',
    'NSBM Green University',
    'SLIIT (Sri Lanka Institute of Information Technology)',
    'IIT (Informatics Institute of Technology)',
    'CINEC Campus',
    'ICBT Campus',
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
    'Colombo International Nautical and Engineering College',
    'Academy of Design',
    'AAT Sri Lanka',
    'Sri Lanka Institute of Development Administration',
    'National Institute of Business Management',
    'Institute of Chemistry Ceylon',
    'Institute of Physics Sri Lanka',
    'Other'
  ]
  const towns = [
    'Colombo', 'Moratuwa', 'Dehiwala-Mount Lavinia', 'Negombo', 'Gampaha', 'Kadawatha', 'Kiribathgoda',
    'Wattala', 'Ragama', 'Kelaniya', 'Panadura', 'Kalutara', 'Beruwala', 'Horana', 'Bandaragama',
    'Kandy', 'Peradeniya', 'Katugastota', 'Gampola', 'Nawalapitiya', 'Kundasale', 'Kadugannawa',
    'Matale', 'Dambulla', 'Sigiriya', 'Nuwara Eliya', 'Hatton', 'Talawakelle',
    'Galle', 'Matara', 'Hikkaduwa', 'Ambalangoda', 'Weligama', 'Mirissa', 'Tangalle', 'Hambantota',
    'Tissamaharama', 'Beliatta', 'Deniyaya',
    'Jaffna', 'Vavuniya', 'Kilinochchi', 'Mannar', 'Point Pedro', 'Chavakachcheri', 'Valvettithurai',
    'Trincomalee', 'Batticaloa', 'Kalmunai', 'Ampara', 'Akkaraipattu', 'Sammanthurai', 'Eravur',
    'Anuradhapura', 'Polonnaruwa', 'Dambulla', 'Sigiriya', 'Habarana', 'Medawachchiya',
    'Badulla', 'Bandarawela', 'Welimada', 'Haputale', 'Monaragala', 'Bibile',
    'Ratnapura', 'Kegalle', 'Avissawella', 'Balangoda', 'Embilipitiya', 'Pelmadulla',
    'Kurunegala', 'Puttalam', 'Chilaw', 'Kuliyapitiya', 'Narammala', 'Dankotuwa', 'Wennappuwa',
    'Seeduwa', 'Katunayake', 'Ja-Ela', 'Mabole', 'Battaramulla', 'Kotte', 'Maharagama', 'Dehiwala',
    'Mount Lavinia', 'Kohuwala', 'Nugegoda', 'Pannipitiya', 'Malabe', 'Kaduwela', 'Homagama',
    'Other'
  ]

  useEffect(() => {
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      const response = await axios.get(`/api/services.php?id=${id}`)
      const service = response.data.data

      setFormData({
        service_type: service.service_type,
        university: service.university,
        town: service.town,
        name: service.name,
        contact_number: service.contact_number,
        description: service.description
      })
      setCurrentImage(service.image)
    } catch (error) {
      console.error('Error fetching service:', error)
      alert('Error loading service details')
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await axios.put('/api/services.php', { ...formData, id })

      // Upload image if selected
      if (image) {
        const imageFormData = new FormData()
        imageFormData.append('image', image)
        imageFormData.append('service_id', id)

        await axios.post('/api/upload_images.php', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      alert('Service updated successfully!')
      navigate('/my-services')
    } catch (error) {
      console.error('Error updating service:', error)
      alert('Error updating service. Please try again.')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Service</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            {currentImage ? (
              <img
                src={`/uploads/${currentImage}`}
                alt="Current"
                className="w-20 h-20 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">🛠️</div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">Current Image</p>
              <p className="text-xs text-gray-500">Keep as is or upload a new one below</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              name="service_type"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.service_type}
              onChange={handleChange}
            >
              <option value="">Select Service Type</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University Area *
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              name="contact_number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.contact_number}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Service'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-services')}
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

export default EditService