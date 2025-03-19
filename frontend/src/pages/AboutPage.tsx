import React from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaCheck, FaLock, FaDatabase, FaCode, FaGlobe } from 'react-icons/fa';

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
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold mb-6">Our Mission</h2>
        <div className="prose prose-lg max-w-none">
          <p>
            Voice for Palestine is a decentralized news and awareness platform dedicated to preserving 
            and verifying news about Palestine. In a world where information can be manipulated, 
            censored, or erased, we believe in the importance of creating a tamper-proof record 
            of Palestinian stories.
          </p>
          <p>
            Our platform uses blockchain technology to ensure that once an article is recorded, 
            its existence and content can be verified by anyone, anywhere, at any time. This creates 
            a permanent, immutable archive of Palestinian narratives that cannot be altered or deleted.
          </p>
          <p>
            We aim to combat misinformation, preserve historical records, and ensure that Palestinian 
            voices are heard and remembered. By combining traditional web technologies with blockchain 
            verification, we create a bridge between accessibility and immutability.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold mb-6">How It Works</h2>
        
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Card 1 */}
          <div className="border-b pb-8">
            <div className="flex items-start">
              <div className="mr-4">
                <FaNewspaper className="text-gray-700 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-3">Content Collection</h3>
                <p className="text-gray-600">
                  Our web crawler automatically collects articles from trusted news sources. 
                  Users can also submit articles they find important.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="border-b pb-8">
            <div className="flex items-start">
              <div className="mr-4">
                <FaLock className="text-gray-700 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-3">Cryptographic Hashing</h3>
                <p className="text-gray-600">
                  We generate a unique SHA-256 hash of each article's content, which serves 
                  as a digital fingerprint that can verify the article hasn't been altered.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="border-b pb-8">
            <div className="flex items-start">
              <div className="mr-4">
                <FaDatabase className="text-gray-700 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-3">Blockchain Storage</h3>
                <p className="text-gray-600">
                  The content hash is stored on the Polygon blockchain, creating a permanent, 
                  tamper-proof record that anyone can verify independently.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="pb-8">
            <div className="flex items-start">
              <div className="mr-4">
                <FaCheck className="text-gray-700 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-3">Verification</h3>
                <p className="text-gray-600">
                  Users can verify any article by URL or content hash to check if it matches 
                  what's recorded on the blockchain, ensuring content integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p>
            This system ensures that even if our website or database were to be compromised, 
            the record of articles and their original content would still exist on the blockchain, 
            providing a permanent archive of Palestinian stories.
          </p>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold mb-6">Our Technology</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-serif font-semibold mb-4 flex items-center">
            <FaCode className="mr-2 text-gray-700" />
            Technology Stack
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Frontend</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>React</li>
                <li>TypeScript</li>
                <li>CSS</li>
                <li>React Router</li>
                <li>Axios</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Backend</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Node.js</li>
                <li>Express</li>
                <li>PostgreSQL</li>
                <li>Web3.js</li>
                <li>Ethers.js</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Blockchain & Crawler</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Polygon Network</li>
                <li>Solidity Smart Contracts</li>
                <li>Python</li>
                <li>BeautifulSoup</li>
                <li>Newspaper3k</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Our platform is open-source and built with modern web technologies. We chose the Polygon 
            blockchain for its low transaction costs, energy efficiency, and compatibility with 
            Ethereum standards. This allows us to store thousands of article verifications without 
            prohibitive costs or environmental impact.
          </p>
        </div>
      </section>

      {/* Get Involved */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold mb-6">Get Involved</h2>
        
        <div className="prose prose-lg max-w-none mb-6">
          <p>
            There are several ways you can contribute to the Voice for Palestine project:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="border-b pb-8 md:border-b-0 md:pb-0 md:border-r md:pr-4">
            <h3 className="text-xl font-serif font-semibold mb-3">Submit Articles</h3>
            <p className="text-gray-600 mb-4">
              Help us grow our archive by submitting important news articles about Palestine.
            </p>
            <Link to="/submit" className="text-gray-800 hover:text-black font-medium">
              Submit an Article
            </Link>
          </div>
          
          <div>
            <h3 className="text-xl font-serif font-semibold mb-3">Spread Awareness</h3>
            <p className="text-gray-600 mb-4">
              Share our platform and verified articles on social media to help spread awareness.
            </p>
            <Link to="/articles" className="text-gray-800 hover:text-black font-medium">
              Browse Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-2xl font-serif font-bold mb-6">Contact Us</h2>
        
        <div>
          <div className="flex items-start mb-4">
            <div className="mr-4">
              <FaGlobe className="text-gray-700 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold mb-3">Get in Touch</h3>
              <p className="text-gray-600 mb-4">
                Have questions, suggestions, or want to collaborate? We'd love to hear from you.
              </p>
              <p className="mb-1">
                <strong>Email:</strong>{' '}
                <a href="mailto:info@voiceforpalestine.xyz" className="text-gray-800 hover:text-black">
                  info@voiceforpalestine.xyz
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a href="https://voiceforpalestine.xyz" className="text-gray-800 hover:text-black">
                  voiceforpalestine.xyz
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
