import React from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-palestine-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Voice for Palestine</h3>
            <p className="text-gray-300 text-sm">
              A decentralized news and awareness platform for Palestine that stores article metadata 
              and hashes on the Polygon blockchain for verification and authenticity.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Submit Article
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Verify Content
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FaIcons.FaGithub className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FaIcons.FaTwitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://voiceforpalestine.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <FaIcons.FaGlobe className="h-6 w-6" />
                <span className="sr-only">Website</span>
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Contact us at: <a href="mailto:info@voiceforpalestine.xyz" className="hover:text-white">info@voiceforpalestine.xyz</a>
            </p>
          </div>
        </div>

        {/* Bottom bar with flag colors */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Voice for Palestine. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-1">
              <div className="h-2 w-16 bg-palestine-black"></div>
              <div className="h-2 w-16 bg-palestine-white"></div>
              <div className="h-2 w-16 bg-palestine-green"></div>
              <div className="h-2 w-16 bg-palestine-red"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
