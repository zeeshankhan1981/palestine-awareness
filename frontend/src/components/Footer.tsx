import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaNewspaper, FaUpload, FaCheck, FaInfoCircle, FaTwitter, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Flag accent bar */}
      <div className="flag-accent">
        <div className="flag-accent-black"></div>
        <div className="flag-accent-white"></div>
        <div className="flag-accent-green"></div>
        <div className="flag-accent-red"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 relative overflow-hidden rounded-full mr-3">
                <div className="absolute inset-0 bg-watermelon-red rounded-full"></div>
                <div className="absolute bottom-0 h-1/3 inset-x-0 bg-watermelon-green"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-1.5 w-1.5 bg-watermelon-seed rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Voice for Palestine</h3>
            </div>
            <p className="text-gray-600 mb-6">
              A decentralized news and awareness platform for Palestine that stores article metadata 
              and hashes on the Polygon blockchain for verification and authenticity.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-palestine-green transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-palestine-green transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-palestine-green transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-palestine-green transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-palestine-green transition-colors flex items-center">
                  <FaHome className="mr-2" size={14} />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-gray-600 hover:text-palestine-green transition-colors flex items-center">
                  <FaNewspaper className="mr-2" size={14} />
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-600 hover:text-palestine-green transition-colors flex items-center">
                  <FaUpload className="mr-2" size={14} />
                  Submit Article
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-gray-600 hover:text-palestine-green transition-colors flex items-center">
                  <FaCheck className="mr-2" size={14} />
                  Verify Content
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-palestine-green transition-colors flex items-center">
                  <FaInfoCircle className="mr-2" size={14} />
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact</h3>
            <ul className="space-y-3 text-gray-600">
              <li>Email: info@voiceforpalestine.org</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Peace St, Global City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Voice for Palestine. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-palestine-green">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-palestine-green">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-palestine-green">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
