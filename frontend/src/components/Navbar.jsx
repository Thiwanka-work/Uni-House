import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const NavItem = ({ to, label, icon: Icon, isButton = false, onClick }) => (
    <div
      className="relative group"
      onMouseEnter={() => setHoveredItem(label)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {isButton ? (
        <button
          onClick={onClick}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:from-yellow-400 hover:to-yellow-500 hover:shadow-lg border border-yellow-300"
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ) : (
        <Link
          to={to}
          onClick={() => setOpen(false)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/10 hover:shadow-md border border-transparent hover:border-white/20"
        >
          <Icon
            size={18}
            className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
          />
          <span className="font-medium">{label}</span>
        </Link>
      )}

      {/* Hover effect line */}
      <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full ${hoveredItem === label ? 'w-full' : ''}`}></div>
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-yellow-500/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">

          {/* Logo with Actual Image */}
          <Link
            to="/"
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            onMouseEnter={() => setHoveredItem('logo')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="bg-white p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <img
                src="/logo.png"
                alt="Uni House Logo"
                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  // Fallback if logo doesn't load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback logo */}
              <div
                className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg hidden"
                style={{ display: 'none' }}
              >
                UH
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Uni House
              </h1>
              <p className="text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Student Hostels
              </p>
            </div>
          </Link>

          {/* Mobile Menu Button with animation */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
          >
            {open ? (
              <div className="w-6 h-6 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-white transform rotate-45 transition-transform duration-300"></div>
                  <div className="w-6 h-0.5 bg-white transform -rotate-45 absolute transition-transform duration-300"></div>
                </div>
              </div>
            ) : (
              <div className="w-6 h-6 flex flex-col justify-between">
                <div className="w-full h-0.5 bg-white transform transition-all duration-300"></div>
                <div className="w-full h-0.5 bg-white transform transition-all duration-300"></div>
                <div className="w-full h-0.5 bg-white transform transition-all duration-300"></div>
              </div>
            )}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">

            {!user ? (
              <>
                <NavItem
                  to="/login"
                  label="Login"
                  icon={() => <span className="text-lg">🔑</span>}
                />
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:from-yellow-400 hover:to-yellow-500 hover:shadow-lg border border-yellow-300"
                >
                  <span className="text-lg">🚀</span>
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <>
                <NavItem
                  to="/search"
                  label="Find Boarding"
                  icon={() => <span className="text-lg">🔍</span>}
                />
                <NavItem
                  to="/services"
                  label="Services"
                  icon={() => <span className="text-lg">🛠️</span>}
                />

                {user.role === 'student' && (
                  <NavItem
                    to="/favorites"
                    label="Favorites"
                    icon={() => <span className="text-lg">❤️</span>}
                  />
                )}

                {user.role === 'owner' && (
                  <>
                    <NavItem
                      to="/add-boarding"
                      label="Add Boarding"
                      icon={() => <span className="text-lg">➕</span>}
                    />
                    <NavItem
                      to="/dashboard"
                      label="Dashboard"
                      icon={() => <span className="text-lg">📊</span>}
                    />
                  </>
                )}

                {user.role === 'service' && (
                  <>
                    <NavItem
                      to="/add-service"
                      label="Add Service"
                      icon={() => <span className="text-lg">➕</span>}
                    />
                    <NavItem
                      to="/my-services"
                      label="My Services"
                      icon={() => <span className="text-lg">🔧</span>}
                    />
                  </>
                )}

                {user.role === 'admin' && (
                  <NavItem
                    to="/admin"
                    label="Admin"
                    icon={() => <span className="text-lg">⚙️</span>}
                  />
                )}

                {/* User Greeting with animation */}
                <div
                  className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
                  onMouseEnter={() => setHoveredItem('user')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">Hi, {user.name.split(' ')[0]}</span>
                </div>

                {/* Logout with enhanced animation */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-white/20 border border-white/20 hover:border-white/40 group"
                  onMouseEnter={() => setHoveredItem('logout')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="text-lg transform transition-transform duration-300 group-hover:rotate-12">🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}

          </div>
        </div>

        {/* Mobile Dropdown with enhanced animations */}
        {open && (
          <div className="md:hidden border-t border-white/20 pt-4 pb-4">
            <div className="flex flex-col space-y-3">

              {!user ? (
                <>
                  <NavItem
                    to="/login"
                    label="Login"
                    icon={() => <span className="text-lg">🔑</span>}
                  />
                  <NavItem
                    to="/register"
                    label="Get Started"
                    icon={() => <span className="text-lg">🚀</span>}
                    isButton={true}
                  />
                </>
              ) : (
                <>
                  <NavItem
                    to="/search"
                    label="Find Boarding"
                    icon={() => <span className="text-lg">🔍</span>}
                  />
                  <NavItem
                    to="/services"
                    label="Services"
                    icon={() => <span className="text-lg">🛠️</span>}
                  />

                  {user.role === 'student' && (
                    <NavItem
                      to="/favorites"
                      label="Favorites"
                      icon={() => <span className="text-lg">❤️</span>}
                    />
                  )}

                  {user.role === 'owner' && (
                    <>
                      <NavItem
                        to="/add-boarding"
                        label="Add Boarding"
                        icon={() => <span className="text-lg">➕</span>}
                      />
                      <NavItem
                        to="/dashboard"
                        label="Dashboard"
                        icon={() => <span className="text-lg">📊</span>}
                      />
                    </>
                  )}

                  {user.role === 'service' && (
                    <>
                      <NavItem
                        to="/add-service"
                        label="Add Service"
                        icon={() => <span className="text-lg">➕</span>}
                      />
                      <NavItem
                        to="/my-services"
                        label="My Services"
                        icon={() => <span className="text-lg">🔧</span>}
                      />
                    </>
                  )}

                  {user.role === 'admin' && (
                    <NavItem
                      to="/admin"
                      label="Admin"
                      icon={() => <span className="text-lg">⚙️</span>}
                    />
                  )}

                  {/* User info in mobile */}
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-blue-200 capitalize">{user.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg transition-all duration-300 transform hover:scale-105 border border-white/20 justify-center"
                  >
                    <span className="text-lg">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Background blur effect when mobile menu is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;