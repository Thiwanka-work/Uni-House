import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-blue-950 text-blue-100 mt-auto border-t border-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Uni House</h3>
            <p className="text-sm text-gray-400">
              Find the perfect boarding place near your university. Connect with verified property owners and service providers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">Search Boardings</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">For Owners</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Register as Owner</Link>
              </li>
              <li>
                <Link to="/add-boarding" className="hover:text-white transition-colors">Add Boarding</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Owner Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>info@unihouse.lk</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-400">
              &copy; {currentYear} Uni House. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
