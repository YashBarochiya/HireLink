import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState(null);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      axios
        .get("http://127.0.0.1:8000/user/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUser(null);
        });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setDashboardDropdownOpen(false);
    setProfileDropdownOpen(false);
    setRegisterDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDashboardDropdownOpen(false);
        setProfileDropdownOpen(false);
        setRegisterDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className={`text-xl font-bold transition-colors ${
              scrolled ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-200'
            }`}>
              <img 
                src="/src/assets/images/logo.png" 
                alt="HireLink Logo" 
                className="h-12 w-auto transition-opacity duration-300" 
                height={48} 
                width={48}
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                scrolled 
                  ? 'text-gray-800 hover:bg-gray-100' 
                  : 'text-black hover:bg-white/10'
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6 text-black`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6 text-black`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              scrolled ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-200'
            }`}>
                  Home
                </Link>
            <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              scrolled ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-200'
            }`}>
                  About
                </Link>
            <Link to="/jobs" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              scrolled ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-200'
            }`}>
                  Job Listings
                </Link>
            <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              scrolled ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-200'
            }`}>
                  Contact
                </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <div className="dropdown-container relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      scrolled 
                        ? 'text-gray-800 hover:bg-gray-100' 
                        : 'text-black hover:bg-white/10'
                    }`}
                  >
                    <span>Profile</span>
                    <svg 
                      className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                        profileDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <Link
                          to={`/edit-profile/${user.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="dropdown-container relative">
                  <button
                    onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      scrolled 
                        ? 'text-gray-800 hover:bg-gray-100' 
                        : 'text-black hover:bg-white/10'
                    }`}
                  >
                    <span>Dashboard</span>
                    <svg 
                      className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                        dashboardDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {dashboardDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Dashboard
                        </Link>
                        {user.role === "employer" && (
                          <Link to="/job/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Create Job
                          </Link>
                        )}
                        <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Logout
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="dropdown-container relative">
                  <button
                    onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      scrolled 
                        ? 'text-gray-800 hover:bg-gray-100' 
                        : 'text-black hover:bg-white/10'
                    }`}
                  >
                    <span>Register</span>
                    <svg 
                      className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                        registerDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {registerDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <Link
                          to="/register-employer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Employer
                        </Link>
                        <Link
                          to="/register-employee"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Employee
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`${
            menuOpen ? 'block opacity-100' : 'hidden opacity-0'
          } md:hidden absolute top-16 left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg z-40 transform transition-all duration-200 ease-in-out`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-black"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-black"
            >
              About
            </Link>
            <Link
              to="/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-black"
            >
              Job Listings
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-black"
            >
              Contact
            </Link>
            {user ? (
              <>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 flex items-center justify-between"
                    >
                      <span>Profile</span>
                      <svg 
                        className={`h-4 w-4 transform transition-transform duration-200 ${
                          profileDropdownOpen ? 'rotate-180' : ''
                        }`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {profileDropdownOpen && (
                      <div className="pl-4">
                        <Link
                          to={`/edit-profile/${user.id}`}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                        >
                            Edit Profile
                          </Link>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2">
                    <button
                      onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 flex items-center justify-between"
                    >
                      <span>Dashboard</span>
                      <svg 
                        className={`h-4 w-4 transform transition-transform duration-200 ${
                          dashboardDropdownOpen ? 'rotate-180' : ''
                        }`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {dashboardDropdownOpen && (
                      <div className="pl-4">
                        <Link
                          to="/dashboard"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                        {user.role === "employer" && (
                          <Link
                            to="/job/create"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                          >
                            Create Job
                          </Link>
                        )}
                        <Link
                          to="/logout"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                        >
                          Logout
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                </>
              ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-3 py-2">
                  <button
                    onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Register</span>
                    <svg 
                      className={`h-4 w-4 transform transition-transform duration-200 ${
                        registerDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </button>
                    {registerDropdownOpen && (
                    <div className="pl-4">
                      <Link
                        to="/register-employer"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                          >
                            Employer
                          </Link>
                          <Link
                            to="/register-employee"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                          >
                            Employee
                          </Link>
                    </div>
                    )}
                </div>
                <div className="px-3 py-2">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Log In
                  </Link>
                </div>
              </div>
              )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
