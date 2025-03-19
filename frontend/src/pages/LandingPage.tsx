import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  const isTestingMode = process.env.REACT_APP_TESTING_MODE === 'true';
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-serif font-bold mb-6">Voice for Palestine</h1>
          
          {isTestingMode && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8 text-left">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-yellow-500 mr-3 mt-1" />
                <div>
                  <p className="font-bold">Testing Mode</p>
                  <p>
                    This website is currently in testing mode. We're working to create a decentralized
                    platform for preserving and verifying news about Palestine. This is just a preview
                    of what's to come.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-xl mb-8">
            A decentralized platform for preserving and verifying news about Palestine
            using blockchain technology.
          </p>
          
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-4">Our Mission</h2>
            <p className="mb-4">
              The Palestine News Hub is dedicated to preserving and verifying news 
              about Palestine in the face of potential censorship and misinformation. 
              By leveraging blockchain technology, we create an immutable record of 
              news articles, ensuring that critical information remains accessible 
              and verifiable.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/about" 
              className="btn btn-primary"
            >
              Learn More
            </Link>
            <Link 
              to="/articles" 
              className="btn btn-secondary"
            >
              Browse Articles <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-100 py-6 px-4 text-center">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} Voice for Palestine {isTestingMode && '| Testing Version'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Hosted on voiceforpalestine.xyz
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
