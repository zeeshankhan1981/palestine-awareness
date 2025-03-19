import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: '/', text: 'Home', icon: <FaIcons.FaHome className="mr-2" /> },
    { to: '/articles', text: 'Articles', icon: <FaIcons.FaNewspaper className="mr-2" /> },
    { to: '/submit', text: 'Submit', icon: <FaIcons.FaUpload className="mr-2" /> },
    { to: '/verify', text: 'Verify', icon: <FaIcons.FaCheck className="mr-2" /> },
    { to: '/about', text: 'About', icon: <FaIcons.FaInfoCircle className="mr-2" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-palestine-black via-palestine-green to-palestine-red text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 relative overflow-hidden rounded-full mr-2">
                <div className="absolute inset-0 bg-watermelon-red rounded-full"></div>
                <div className="absolute bottom-0 h-1/3 inset-x-0 bg-watermelon-green"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-1.5 w-1.5 bg-watermelon-seed rounded-full"></div>
                </div>
              </div>
              <span className="font-bold text-xl">Voice for Palestine</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'bg-white text-palestine-green'
                    : 'text-white hover:bg-palestine-green/20'
                }`}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-palestine-green/20 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaIcons.FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaIcons.FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-palestine-black/90 backdrop-blur-sm">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.to)
                  ? 'bg-white text-palestine-green'
                  : 'text-white hover:bg-palestine-green/20'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.icon}
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
