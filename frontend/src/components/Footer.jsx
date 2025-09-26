import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-between gap-8 text-center sm:text-left">
          {/* Brand Section */}
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-lg font-bold border-b-2 border-white inline-block pb-1 mb-3">
              MkulimaHub
            </h4>
            <p className="text-sm leading-relaxed">
              Connecting farmers directly to you for fresh, quality produce.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-lg font-bold border-b-2 border-white inline-block pb-1 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/home" className="hover:text-gray-300 transition">Home</a></li>
              <li><a href="/marketplace" className="hover:text-gray-300 transition">Marketplace</a></li>
              <li><a href="/login" className="hover:text-gray-300 transition">Login</a></li>
              <li><a href="/register" className="hover:text-gray-300 transition">Register</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-lg font-bold border-b-2 border-white inline-block pb-1 mb-3">
              Follow Us
            </h4>
            <div className="flex justify-center sm:justify-start gap-4 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition text-xl"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition text-xl"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition text-xl"><FaInstagram /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-6 pt-4 text-center text-xs text-gray-300">
          <p>&copy; {new Date().getFullYear()} MkulimaHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
