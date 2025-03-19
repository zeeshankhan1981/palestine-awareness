import React from 'react';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-6">
          {/* Watermelon 404 graphic */}
          <div className="relative inline-block">
            <div className="h-32 w-32 bg-watermelon-red rounded-full mx-auto relative overflow-hidden">
              <div className="absolute bottom-0 h-1/3 inset-x-0 bg-watermelon-green"></div>
              
              {/* Seeds */}
              <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-2 w-2 bg-watermelon-seed rounded-full"></div>
              </div>
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-2 w-2 bg-watermelon-seed rounded-full"></div>
              </div>
              <div className="absolute top-2/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-2 w-2 bg-watermelon-seed rounded-full"></div>
              </div>
              
              {/* 404 text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">404</span>
              </div>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-palestine-black mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="btn btn-primary flex items-center justify-center">
            <FaIcons.FaHome className="mr-2" />
            Go to Homepage
          </Link>
          <Link to="/articles" className="btn btn-secondary flex items-center justify-center">
            <FaIcons.FaNewspaper className="mr-2" />
            Browse Articles
          </Link>
        </div>
        
        {/* Flag colors */}
        <div className="mt-12 flex h-2 max-w-xs mx-auto">
          <div className="flex-1 bg-palestine-black"></div>
          <div className="flex-1 bg-palestine-white"></div>
          <div className="flex-1 bg-palestine-green"></div>
          <div className="flex-1 bg-palestine-red"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
