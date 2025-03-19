import React from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Palestinian flag colors and watermelon pattern */}
      <section className="relative py-20 overflow-hidden">
        {/* Watermelon pattern background */}
        <div className="absolute inset-0 watermelon-bg opacity-10"></div>
        
        {/* Flag color bars at the top */}
        <div className="absolute top-0 left-0 right-0 flex h-2">
          <div className="flex-1 bg-palestine-black"></div>
          <div className="flex-1 bg-palestine-white"></div>
          <div className="flex-1 bg-palestine-green"></div>
          <div className="flex-1 bg-palestine-red"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-palestine-black mb-6">
              Voice for Palestine
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              A decentralized news and awareness platform that preserves and verifies 
              Palestinian stories on the blockchain.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/articles" 
                className="btn btn-primary text-center flex items-center justify-center"
              >
                <FaIcons.FaNewspaper className="mr-2" />
                Browse Articles
              </Link>
              <Link 
                to="/verify" 
                className="btn btn-secondary text-center flex items-center justify-center"
              >
                <FaIcons.FaCheck className="mr-2" />
                Verify Content
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-palestine-black">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-palestine-green">
              <div className="w-12 h-12 bg-palestine-green/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaIcons.FaNewspaper className="text-palestine-green text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Trusted Sources</h3>
              <p className="text-gray-600 text-center">
                We collect articles from trusted news sources and verify their authenticity 
                using blockchain technology.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-palestine-red">
              <div className="w-12 h-12 bg-palestine-red/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaIcons.FaUpload className="text-palestine-red text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Submit Articles</h3>
              <p className="text-gray-600 text-center">
                Users can submit articles they find important, which are then verified 
                and stored on the blockchain.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-palestine-black">
              <div className="w-12 h-12 bg-palestine-black/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaIcons.FaCheck className="text-palestine-black text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Verify Content</h3>
              <p className="text-gray-600 text-center">
                Check if an article has been tampered with by comparing its content 
                hash with what's stored on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-palestine-green to-palestine-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Help preserve and verify Palestinian stories by contributing to our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/submit" 
              className="bg-white text-palestine-green hover:bg-gray-100 btn flex items-center justify-center"
            >
              <FaIcons.FaUpload className="mr-2" />
              Submit an Article
            </Link>
            <Link 
              to="/about" 
              className="bg-palestine-black/30 hover:bg-palestine-black/50 text-white btn flex items-center justify-center"
            >
              <FaIcons.FaInfoCircle className="mr-2" />
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
