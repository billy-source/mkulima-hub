import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-green-200 transition-colors">
          MkulimaHub
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`md:flex items-center space-x-6 ${
            isOpen
              ? "flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 w-full bg-green-700 md:bg-transparent transition-transform duration-300 transform md:transform-none z-50"
              : "hidden"
          }`}
        >
          <div className="md:flex md:space-x-6 flex flex-col md:flex-row items-center w-full md:w-auto p-4 md:p-0">
            <Link to="/marketplace" className="py-2 px-4 hover:bg-green-600 rounded-md transition-colors w-full text-center">
              Marketplace
            </Link>
            <Link to="/about" className="py-2 px-4 hover:bg-green-600 rounded-md transition-colors w-full text-center">
              About
            </Link>
            <Link to="/contacts" className="py-2 px-4 hover:bg-green-600 rounded-md transition-colors w-full text-center">
              Contacts
            </Link>

            {/* Show only if logged in */}
            {isLoggedIn && (
              <>
                <Link to="/dashboard" className="py-2 px-4 hover:bg-green-600 rounded-md transition-colors w-full text-center">
                  Dashboard
                </Link>
                <Link to="/cart" className="py-2 px-4 hover:bg-green-600 rounded-md transition-colors w-full text-center">
                  Cart
                </Link>
                <button onClick={handleLogout} className="py-2 px-4 hover:bg-red-600 rounded-md transition-colors w-full text-center">
                  Logout
                </button>
              </>
            )}

            {/* Show login if NOT logged in */}
            {!isLoggedIn && (
              <Link to="/login" className="py-2 px-4 bg-green-800 hover:bg-green-900 rounded-md transition-colors w-full text-center mt-2 md:mt-0">
                Login 
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
