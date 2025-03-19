import React from 'react';

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
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice for Palestine</h3>
          <p className="text-gray-600 max-w-2xl mb-4">
            A decentralized news and awareness platform for Palestine that stores article metadata 
            and hashes on the Polygon blockchain for verification and authenticity.
          </p>
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Voice for Palestine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
