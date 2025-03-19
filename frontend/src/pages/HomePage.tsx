import React from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaShieldAlt, FaGlobe, FaDatabase, FaUpload } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section with subtle watermelon pattern */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Subtle watermelon pattern background */}
        <div className="absolute inset-0 watermelon-bg"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Voice for Palestine</h1>
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
                to="/submit" 
                className="btn btn-secondary"
              >
                <FaUpload className="mr-2" />
                Submit Article
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg mb-6">
              The Palestine News Hub is dedicated to preserving and verifying news 
              about Palestine in the face of potential censorship and misinformation. 
              By leveraging blockchain technology, we create an immutable record of 
              news articles, ensuring that critical information remains accessible 
              and verifiable.
            </p>
            <p className="text-lg">
              In a world where digital content can be altered or removed, our platform 
              provides a permanent, tamper-proof archive of Palestinian narratives and 
              experiences, preserving the truth for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">Why Voice for Palestine?</h2>
            <div className="w-24 h-1 bg-palestine-green mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-palestine-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-2xl text-palestine-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">Censorship Resistant</h3>
              <p>
                Once published, articles cannot be removed or altered, protecting 
                Palestinian narratives from censorship or erasure.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-palestine-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGlobe className="text-2xl text-palestine-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Accessibility</h3>
              <p>
                Our decentralized platform ensures that information about Palestine 
                remains accessible worldwide, regardless of regional restrictions.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-palestine-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaDatabase className="text-2xl text-palestine-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verifiable Truth</h3>
              <p>
                Blockchain verification allows anyone to confirm the authenticity 
                and publication date of articles, combating misinformation.
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
