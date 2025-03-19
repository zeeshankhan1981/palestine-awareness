import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaNewspaper, FaUpload, FaCheck, FaInfoCircle, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import WalletConnect from './blockchain/WalletConnect';
import { useBlockchain } from '../contexts/BlockchainContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { account, isVerified, userRole } = useBlockchain();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: '/', text: 'Home', icon: <FaHome className="mr-2" /> },
    { to: '/articles', text: 'Articles', icon: <FaNewspaper className="mr-2" /> },
    { to: '/submit', text: 'Submit', icon: <FaUpload className="mr-2" /> },
    { to: '/verify', text: 'Verify', icon: <FaCheck className="mr-2" /> },
    { to: '/about', text: 'About', icon: <FaInfoCircle className="mr-2" /> },
    { to: '/profile', text: 'Profile', icon: <FaUser className="mr-2" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Flag accent bar */}
      <div className="flag-accent">
        <div className="flag-accent-black"></div>
        <div className="flag-accent-white"></div>
        <div className="flag-accent-green"></div>
        <div className="flag-accent-red"></div>
      </div>
      
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="navbar-brand">
            <div className="h-10 w-10 relative overflow-hidden rounded-full mr-3">
              <div className="absolute inset-0 bg-watermelon-red rounded-full"></div>
              <div className="absolute bottom-0 h-1/3 inset-x-0 bg-watermelon-green"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-1.5 w-1.5 bg-watermelon-seed rounded-full"></div>
              </div>
            </div>
            <span className="font-serif font-bold text-lg">Voice for Palestine</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-item nav-link flex items-center ${
                  isActive(link.to) ? 'active font-medium' : ''
                }`}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
            
            {/* Wallet Connect Button */}
            <div className="ml-4">
              <WalletConnect />
            </div>
            
            {/* User Verification Status */}
            {account && isVerified && (
              <div className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Verified
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden btn btn-sm btn-secondary flex items-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            className="btn btn-sm btn-secondary"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center pt-5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center py-4 px-6 w-full text-center text-lg ${
                isActive(link.to)
                  ? 'text-black font-medium'
                  : 'text-gray-700'
              }`}
              onClick={toggleMenu}
            >
              {link.icon}
              {link.text}
            </Link>
          ))}
          
          {/* Mobile Wallet Connect */}
          <div className="py-4 px-6 w-full">
            <WalletConnect />
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;
