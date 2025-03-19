import React from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaCheck, FaLock, FaDatabase, FaCode, FaGlobe, FaFingerprint, FaSearch, FaPaperPlane, FaTwitter, FaFacebook, FaHandHoldingHeart, FaEnvelope, FaShare, FaExternalLinkAlt, FaHashtag } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">About Palestine News Hub</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Learn about our mission, technology, and how we're preserving Palestinian stories.
        </p>
      </header>

      {/* Mission Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-4">
              The Palestine News Hub is dedicated to preserving and verifying news 
              about Palestine in the face of potential censorship and misinformation. 
              By leveraging blockchain technology, we create an immutable record of 
              news articles, ensuring that critical information remains accessible 
              and verifiable.
            </p>
            <p>
              Our platform allows anyone to submit news articles from reputable sources, 
              which are then verified and stored both in our database and on the 
              Polygon blockchain. This dual-storage approach ensures that even if our 
              platform faces censorship, the record of these articles remains intact 
              and verifiable.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-serif font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body">
              <div className="flex justify-center items-center h-16 w-16 rounded-full bg-gray-100 mb-4 mx-auto">
                <FaNewspaper className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-center">Submit</h3>
              <p className="text-center text-gray-600">
                Users submit articles from reputable news sources about Palestine.
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <div className="flex justify-center items-center h-16 w-16 rounded-full bg-gray-100 mb-4 mx-auto">
                <FaFingerprint className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-center">Protect</h3>
              <p className="text-center text-gray-600">
                We generate a unique hash of the article content and store it on the blockchain.
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <div className="flex justify-center items-center h-16 w-16 rounded-full bg-gray-100 mb-4 mx-auto">
                <FaSearch className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-center">Access</h3>
              <p className="text-center text-gray-600">
                Anyone can access and confirm the authenticity of articles using our platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Get Involved */}
      <div className="mb-12">
        <h2 className="text-3xl font-serif font-bold mb-6">Get Involved</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-6">
              There are several ways you can contribute to the Palestine News Hub:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                    <FaPaperPlane className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2">Submit Articles</h3>
                  <p className="text-gray-600 mb-3">
                    Help us build our archive by submitting articles from reputable sources.
                  </p>
                  <Link to="/submit" className="btn btn-primary btn-sm">
                    Submit an Article
                  </Link>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                    <FaCode className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2">Contribute Code</h3>
                  <p className="text-gray-600 mb-3">
                    This project is open source. Help us improve the platform.
                  </p>
                  <a 
                    href="https://github.com/zeeshankhan1981/palestine-awareness" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    GitHub Repository
                  </a>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                    <FaShare className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2">Spread the Word</h3>
                  <p className="text-gray-600 mb-3">
                    Share our platform with others who care about preserving the truth.
                  </p>
                  <div className="flex space-x-2">
                    <a 
                      href="https://twitter.com/intent/tweet?url=https://palestine-news-hub.org&text=Preserving%20and%20verifying%20news%20about%20Palestine%20using%20blockchain%20technology" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <FaTwitter className="mr-1" />
                      Share
                    </a>
                    <a 
                      href="https://www.facebook.com/sharer/sharer.php?u=https://palestine-news-hub.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <FaFacebook className="mr-1" />
                      Share
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                    <FaHandHoldingHeart className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2">Donate</h3>
                  <p className="text-gray-600 mb-3">
                    Support our operational costs and help us expand our capabilities.
                  </p>
                  <a 
                    href="#" 
                    className="btn btn-primary btn-sm"
                  >
                    Coming Soon
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
