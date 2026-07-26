import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Rocket, Search, PenTool, Heart, Plus, BarChart3, Wrench, Settings, LogOut, Menu, X } from 'lucide-react';

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
      className="relative"
      onMouseEnter={() => setHoveredItem(label)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {isButton ? (
        <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.97 }}>
          <Link
            to={to}
            onClick={() => setOpen(false)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold rounded-xl shadow-md shadow-indigo-200/60 hover:shadow-lg hover:shadow-sky-200/60 transition-shadow duration-300 border border-transparent"
          >
            <Icon size={16} className="text-white" />
            <span>{label}</span>
          </Link>
        </motion.div>
      ) : (
        <Link
          to={to}
          onClick={() => setOpen(false)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors duration-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80"
        >
          <motion.div
            animate={hoveredItem === label ? { scale: 1.2, rotate: 8 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Icon size={16} className={hoveredItem === label ? 'text-indigo-500' : 'text-slate-400'} />
          </motion.div>
          <span className="font-medium text-sm">{label}</span>
        </Link>
      )}

      {/* Animated underline */}
      {!isButton && (
        <motion.div
          className="absolute -bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={hoveredItem === label ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ originX: 0.5 }}
        />
      )}
    </div>
  );

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1, y: 0, height: 'auto',
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
      opacity: 0, y: -8, height: 0,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 text-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">

          {/* Logo */}
          <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Link
              to="/"
              className="flex items-center space-x-3 group"
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white p-2 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-slate-100"
              >
                <img
                  src="/logo.png"
                  alt="Uni House Logo"
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ display: 'none' }}
                >
                  UH
                </div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold gradient-text leading-tight">Uni House</h1>
                <p className="text-xs text-slate-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Student Hostels
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={open ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {!user ? (
              <>
                <NavItem to="/login" label="Login" icon={Key} />
                <div className="pl-1">
                  <NavItem to="/register" label="Register" icon={Rocket} isButton={true} />
                </div>
              </>
            ) : (
              <>
                <NavItem to="/search" label="Find Boarding" icon={Search} />
                <NavItem to="/services" label="Services" icon={PenTool} />

                {user.role === 'student' && <NavItem to="/favorites" label="Favorites" icon={Heart} />}

                {user.role === 'owner' && (
                  <>
                    <NavItem to="/add-boarding" label="Add Boarding" icon={Plus} />
                    <NavItem to="/dashboard" label="Dashboard" icon={BarChart3} />
                  </>
                )}

                {user.role === 'service' && (
                  <>
                    <NavItem to="/add-service" label="Add Service" icon={Plus} />
                    <NavItem to="/my-services" label="My Services" icon={Wrench} />
                  </>
                )}

                {user.role === 'admin' && <NavItem to="/admin" label="Admin" icon={Settings} />}

                <div className="h-8 w-px bg-slate-200 mx-2" />

                {/* User Badge */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </motion.div>
                  <span className="font-semibold text-slate-700 text-sm">{user.name.split(' ')[0]}</span>
                </motion.div>

                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1.5 px-3 py-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut size={17} />
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden overflow-hidden"
            >
              <div className="border-t border-slate-200 pt-4 pb-4">
                <div className="flex flex-col space-y-1 bg-white/60 rounded-2xl p-4">
                  {!user ? (
                    <>
                      <motion.div custom={0} variants={mobileItemVariants} initial="hidden" animate="visible">
                        <NavItem to="/login" label="Login" icon={Key} />
                      </motion.div>
                      <motion.div custom={1} variants={mobileItemVariants} initial="hidden" animate="visible">
                        <NavItem to="/register" label="Get Started" icon={Rocket} isButton={true} />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {[
                        { to: '/search', label: 'Find Boarding', icon: Search, show: true },
                        { to: '/services', label: 'Services', icon: PenTool, show: true },
                        { to: '/favorites', label: 'Favorites', icon: Heart, show: user.role === 'student' },
                        { to: '/add-boarding', label: 'Add Boarding', icon: Plus, show: user.role === 'owner' },
                        { to: '/dashboard', label: 'Dashboard', icon: BarChart3, show: user.role === 'owner' },
                        { to: '/add-service', label: 'Add Service', icon: Plus, show: user.role === 'service' },
                        { to: '/my-services', label: 'My Services', icon: Wrench, show: user.role === 'service' },
                        { to: '/admin', label: 'Admin', icon: Settings, show: user.role === 'admin' },
                      ].filter(i => i.show).map((item, idx) => (
                        <motion.div key={item.label} custom={idx} variants={mobileItemVariants} initial="hidden" animate="visible">
                          <NavItem to={item.to} label={item.label} icon={item.icon} />
                        </motion.div>
                      ))}

                      {/* User info */}
                      <motion.div
                        custom={8} variants={mobileItemVariants} initial="hidden" animate="visible"
                        className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100 mt-2"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">{user.name}</div>
                          <div className="text-xs text-indigo-500 font-medium capitalize">{user.role}</div>
                        </div>
                      </motion.div>

                      <motion.button
                        custom={9} variants={mobileItemVariants} initial="hidden" animate="visible"
                        onClick={handleLogout}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center space-x-2 px-4 py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 transition-colors duration-200 mt-1 justify-center w-full"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;