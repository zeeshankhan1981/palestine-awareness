import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const TestingModeBanner: React.FC = () => {
  return (
    <div className="bg-palestine-red text-white p-2 text-center">
      <div className="flex items-center justify-center">
        <FaExclamationTriangle className="mr-2" />
        <span className="font-bold">TESTING MODE - This is a development version of Palestine News Hub</span>
      </div>
    </div>
  );
};

export default TestingModeBanner;
