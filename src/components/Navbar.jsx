import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const defaultUserImage =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/");
        setDropdownOpen(false);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/ide", label: "IDE", icon: "💻" },
  ];

  return (
    <nav className="bg-white shadow-medium border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-secondary-900 hidden sm:block">
              CodeRunner
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary-100 text-primary-700"
                    : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-secondary-900">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {user.email}
                    </p>
                  </div>
                  <button
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary-200 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-label="User Menu"
                  >
                    <img
                      src={user.photoURL || defaultUserImage}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-secondary-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-secondary-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors duration-200"
                      onClick={() => {
                        navigate("/ide");
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="mr-2">💻</span>
                      Open IDE
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors duration-200"
                      onClick={handleSignOut}
                    >
                      <span className="mr-2">🚪</span>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="ide"
                  className="btn-secondary text-sm px-4 py-2"
                >
                  <span className="mr-1">⚡</span>
                  Try Now
                </Link>
                <Link
                  to="signup"
                  className="btn-primary text-sm px-4 py-2"
                >
                  <span className="mr-1">👤</span>
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary-100 text-primary-700"
                      : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {!user && (
                <div className="pt-4 border-t border-secondary-200 space-y-2">
                  <Link
                    to="ide"
                    className="flex items-center justify-center space-x-2 w-full btn-secondary text-sm px-4 py-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>⚡</span>
                    <span>Try Now</span>
                  </Link>
                  <Link
                    to="signup"
                    className="flex items-center justify-center space-x-2 w-full btn-primary text-sm px-4 py-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>👤</span>
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
