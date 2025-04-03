import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white rounded-t-3xl shadow dark:bg-gray-900 mx-0 mb-0">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          
          {/* Left Side - Logo & Slogan */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.png" className="h-10" alt="AgriRent Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
             "Smart Farming Easy Renting "
            </span>
          </div>

          {/* Right Side - Social Media Icons */}
          <div className="flex space-x-5 mt-4 sm:mt-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <FaInstagram size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <FaLinkedin size={24} />
            </a>
          </div>
          
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {new Date().getFullYear()} <a href="/" className="hover:underline">AgriRent</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
