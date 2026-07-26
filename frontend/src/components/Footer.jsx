import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400 inline-block mb-2">Uni House</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find the perfect boarding place near your university. Connect with verified property owners and service providers in a modern ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-sky-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors"></span>
                  <span>Search Boardings</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-sky-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors"></span>
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-sky-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors"></span>
                  <span>Favorites</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">For Owners</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/register" className="hover:text-sky-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors"></span>
                  <span>Register as Owner</span>
                </Link>
              </li>
              <li>
                <Link to="/add-boarding" className="hover:text-sky-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors"></span>
                  <span>Add Boarding</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-sky-400 transition-colors flex items-center space-x-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors"></span>
                  <span>Owner Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <Mail className="w-4 h-4 text-sky-400" />
                </div>
                <span>info@unihouse.lk</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <Phone className="w-4 h-4 text-sky-400" />
                </div>
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <MapPin className="w-4 h-4 text-sky-400" />
                </div>
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm font-medium">
            <p className="text-slate-500">
              &copy; {currentYear} Uni House. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-slate-500 hover:text-sky-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-slate-500 hover:text-sky-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-slate-500 hover:text-sky-400 transition-colors">
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
