import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SearchBoardings from './pages/SearchBoardings'
import BoardingDetails from './pages/BoardingDetails'
import AddBoarding from './pages/AddBoarding'
import EditBoarding from './pages/EditBoarding'
import OwnerDashboard from './pages/OwnerDashboard'
import Services from './pages/Services'
import AddService from './pages/AddService'
import AdminDashboard from './pages/AdminDashboard'
import Favorites from './pages/Favorites'
import EditService from './pages/EditService'
import ServiceDashboard from './pages/ServiceDashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchBoardings />} />
            <Route path="/boarding/:id" element={<BoardingDetails />} />
            <Route path="/add-boarding" element={<AddBoarding />} />
            <Route path="/edit-boarding/:id" element={<EditBoarding />} />
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/add-service" element={<AddService />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/edit-service/:id" element={<EditService />} />
            <Route path="/my-services" element={<ServiceDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App