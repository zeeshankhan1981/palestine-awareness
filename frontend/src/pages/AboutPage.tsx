import React from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaCheck, FaLock, FaDatabase, FaCode, FaGlobe } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-palestine-black mb-2">About Voice for Palestine</h1>
        <p className="text-gray-600">
          Learn about our mission, technology, and how we're preserving Palestinian stories.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-palestine-green">Our Mission</h2>
        <div className="prose max-w-none">
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
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-palestine-green">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1 */}
          <div className="card p-6">
            <div className="flex items-start mb-4">
              <div className="bg-palestine-green/10 p-3 rounded-full mr-4">
                <FaNewspaper className="text-palestine-green text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Content Collection</h3>
                <p className="text-gray-600">
                  Our web crawler automatically collects articles from trusted news sources. 
                  Users can also submit articles they find important.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="card p-6">
            <div className="flex items-start mb-4">
              <div className="bg-palestine-red/10 p-3 rounded-full mr-4">
                <FaLock className="text-palestine-red text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Cryptographic Hashing</h3>
                <p className="text-gray-600">
                  We generate a unique SHA-256 hash of each article's content, which serves 
                  as a digital fingerprint that can verify the article hasn't been altered.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="card p-6">
            <div className="flex items-start mb-4">
              <div className="bg-palestine-black/10 p-3 rounded-full mr-4">
                <FaDatabase className="text-palestine-black text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Blockchain Storage</h3>
                <p className="text-gray-600">
                  The content hash is stored on the Polygon blockchain, creating a permanent, 
                  tamper-proof record that anyone can verify independently.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="card p-6">
            <div className="flex items-start mb-4">
              <div className="bg-palestine-green/10 p-3 rounded-full mr-4">
                <FaCheck className="text-palestine-green text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Verification</h3>
                <p className="text-gray-600">
                  Users can verify any article by URL or content hash to check if it matches 
                  what's recorded on the blockchain, ensuring content integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p>
            This system ensures that even if our website or database were to be compromised, 
            the record of articles and their original content would still exist on the blockchain, 
            providing a permanent archive of Palestinian stories.
          </p>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-palestine-green">Our Technology</h2>
        
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaCode className="mr-2 text-palestine-black" />
            Technology Stack
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-palestine-green">Frontend</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>React</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>React Router</li>
                <li>Axios</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-palestine-green">Backend</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Node.js</li>
                <li>Express</li>
                <li>PostgreSQL</li>
                <li>Web3.js</li>
                <li>Ethers.js</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-palestine-green">Blockchain & Crawler</h4>
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
        
        <div className="prose max-w-none">
          <p>
            Our platform is open-source and built with modern web technologies. We chose the Polygon 
            blockchain for its low transaction costs, energy efficiency, and compatibility with 
            Ethereum standards. This allows us to store thousands of article verifications without 
            prohibitive costs or environmental impact.
          </p>
        </div>
      </section>

      {/* Get Involved */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-palestine-green">Get Involved</h2>
        
        <div className="prose max-w-none mb-6">
          <p>
            There are several ways you can contribute to the Voice for Palestine project:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2">Submit Articles</h3>
            <p className="text-gray-600 mb-4">
              Help us grow our archive by submitting important news articles about Palestine.
            </p>
            <Link to="/submit" className="btn btn-primary inline-block">
              Submit an Article
            </Link>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-2">Spread Awareness</h3>
            <p className="text-gray-600 mb-4">
              Share our platform and verified articles on social media to help spread awareness.
            </p>
            <Link to="/articles" className="btn btn-primary inline-block">
              Browse Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-palestine-green">Contact Us</h2>
        
        <div className="card p-6">
          <div className="flex items-start mb-4">
            <div className="bg-palestine-green/10 p-3 rounded-full mr-4">
              <FaGlobe className="text-palestine-green text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Get in Touch</h3>
              <p className="text-gray-600 mb-4">
                Have questions, suggestions, or want to collaborate? We'd love to hear from you.
              </p>
              <p className="mb-1">
                <strong>Email:</strong>{' '}
                <a href="mailto:info@voiceforpalestine.xyz" className="text-palestine-green hover:underline">
                  info@voiceforpalestine.xyz
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a href="https://voiceforpalestine.xyz" className="text-palestine-green hover:underline">
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
