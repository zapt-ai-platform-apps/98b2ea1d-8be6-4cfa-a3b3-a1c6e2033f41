import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="flex items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Apprentice 360 - All rights reserved
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a 
              href="https://apprentice360.co.uk/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Terms of Service
            </a>
            <a 
              href="https://apprentice360.co.uk/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Privacy Policy
            </a>
            <a 
              href="https://apprentice360.co.uk/dpa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              GDPR Data Processing Agreement
            </a>
          </div>
          
          <div className="mt-4 md:mt-0">
            <a 
              href="https://www.zapt.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Made on ZAPT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;