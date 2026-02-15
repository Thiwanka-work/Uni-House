import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const AddService = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [shake, setShake] = useState(false)

  const [formData, setFormData] = useState({
    service_type: '',
    university: '',
    town: '',
    name: '',
    contact_number: user?.phone || '',
    description: ''
  })

  const serviceTypes = [
    'Plumber',
    'Electrician',
    'Carpenter',
    'Cleaning',
    'Painter',
    'AC Repair',
    'Security',
    'Internet Service',
    'Water Supply',
    'Other'
  ]

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

  React.useEffect(() => {
    if (!user || user.role !== 'service') {
      navigate('/login')
    }
  }, [user, navigate])

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
    setLoading(true)

    // Validation
    if (!formData.service_type || !formData.university || !formData.town || !formData.name || !formData.contact_number || !formData.description) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setLoading(false)
      return
    }

    try {
      const response = await axios.post('/api/services.php', formData)
      const serviceId = response.data.data.id

      // Upload image if selected
      if (image) {
        const imageFormData = new FormData()
        imageFormData.append('image', image)
        imageFormData.append('service_id', serviceId)

        await axios.post('/api/upload_images.php', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      alert('🎉 Service added successfully! Now visible to all users.')
      navigate('/my-services')
    } catch (error) {
      console.error('Error adding service:', error)
      alert('❌ Error adding service. Please try again.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    setLoading(false)
  }

  if (!user || user.role !== 'service') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header with Animation */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-500">
            <span className="text-white text-2xl">🛠️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Add New Service
          </h1>
          <p className="text-gray-600 mt-2">Reach thousands of students near universities</p>
        </div>

        {/* Animated Form */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-500 ${shake ? 'animate-shake' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Service Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span className="text-lg">🔧</span>
                <span>Service Type *</span>
              </label>
              <select
                name="service_type"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-400"
                value={formData.service_type}
                onChange={handleChange}
              >
                <option value="">Select Service Type</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* University and Town */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <span className="text-lg">🎓</span>
                  <span>University Area *</span>
                </label>
                <select
                  name="university"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-400"
                  value={formData.university}
                  onChange={handleChange}
                >
                  <option value="">Select University</option>
                  {universities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <span className="text-lg">🏙️</span>
                  <span>Town/City *</span>
                </label>
                <select
                  name="town"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-400"
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

            {/* Service Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span className="text-lg">🏢</span>
                <span>Service Name *</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-400"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., John's Plumbing Service"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span className="text-lg">📞</span>
                <span>Contact Number *</span>
              </label>
              <input
                type="tel"
                name="contact_number"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-400"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="07XXXXXXXX"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span className="text-lg">📝</span>
                <span>Description *</span>
              </label>
              <textarea
                name="description"
                required
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-400 resize-none"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service, experience, areas you cover, pricing, availability, etc."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span className="text-lg">🖼️</span>
                <span>Service Image (Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-gray-600">Click to upload service image</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding Service...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Add Service</span>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default AddService