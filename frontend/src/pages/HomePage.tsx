import React from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaCheck, FaShieldAlt, FaGlobe, FaDatabase } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section with subtle watermelon pattern */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Subtle watermelon pattern background */}
        <div className="absolute inset-0 watermelon-bg"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              A decentralized news and awareness platform that preserves and verifies 
              Palestinian stories on the blockchain.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/articles" 
                className="btn btn-primary"
              >
                <FaNewspaper className="mr-2" />
                Browse Articles
              </Link>
              <Link 
                to="/verify" 
                className="btn btn-secondary"
              >
                <FaCheck className="mr-2" />
                Verify Content
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Voice for Palestine?</h2>
            <div className="w-24 h-1 bg-palestine-green mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-palestine-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-palestine-green text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Content</h3>
              <p className="text-gray-600">
                All articles are cryptographically verified and stored on the blockchain,
                ensuring authenticity and preventing censorship.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-palestine-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGlobe className="text-palestine-red text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Awareness</h3>
              <p className="text-gray-600">
                Spreading awareness about the Palestinian cause through verified news
                and stories from trusted sources around the world.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-palestine-black bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaDatabase className="text-palestine-black text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Decentralized Storage</h3>
              <p className="text-gray-600">
                Content is stored on the Polygon blockchain, making it resistant to
                censorship and ensuring long-term preservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-palestine-green to-palestine-green opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
            <p className="text-xl mb-8">
              Help us preserve and verify Palestinian stories by submitting articles,
              verifying content, or spreading awareness.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/submit" className="btn btn-primary">
                Submit an Article
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
