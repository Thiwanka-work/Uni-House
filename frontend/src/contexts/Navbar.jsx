import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">Boarding Finder</Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/search" className="hover:text-blue-200">Find Boarding</Link>
            <Link to="/services" className="hover:text-blue-200">Services</Link>
            
            {user ? (
              <>
                {user.role === 'student' && (
                  <Link to="/favorites" className="hover:text-blue-200">Favorites</Link>
                )}
                {user.role === 'owner' && (
                  <>
                    <Link to="/add-boarding" className="hover:text-blue-200">Add Boarding</Link>
                    <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                  </>
                )}
                {user.role === 'service' && (
                  <Link to="/add-service" className="hover:text-blue-200">Add Service</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200">Admin</Link>
                )}
                <span>Hello, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar