import { useState } from "react";
import { Link } from "react-router";

function Navbar() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(o => !o);
  const closeMenu = () => setOpen(false);
  const regularNavLinks = [
    {
      name: "Jobs",
      url: "/jobs",
    },
    {
      name: "About Us",
      url: "/about",
    },
    {
      name: "Contact",
      url: "/contact",
    },
  ];

  return (
    <nav className="bg-white mx-25 mt-5 shadow-sm rounded-xl px-4 md:px-6 py-3 flex items-center justify-between relative">
      {/* Brand */}
      <div className="flex items-center flex-shrink-0">
        <img
          src="/images/auth/logo.png"
          alt="TalentHub"
          className="h-8 w-auto"
        />
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
        {regularNavLinks.map(link => (
          <Link
            to={link.url}
            key={link.name}
            className="px-2 lg:px-3 py-1 text-[#5D6D7E] font-medium hover:text-[#1E73BE] transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center">
        <Link 
          to="/register" 
          className="text-[#5D6D7E] px-4 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Sign Up
        </Link>
        <Link 
          to="/login" 
          className="bg-[#1E73BE] text-white px-4 py-1 rounded-lg hover:bg-[#155d97] transition-colors ml-2"
        >
          Login
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={toggle}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span className="sr-only">Menu</span>
        <svg
          className={`w-6 h-6 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {open ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <>
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden absolute z-99 left-0 right-0 top-full mt-2 origin-top transform transition-all duration-200 px-4 ${open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"}`}
      >
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col p-3">
            {regularNavLinks.map(link => (
              <Link
                to={link.url}
                key={link.name}
                onClick={closeMenu}
                className="px-3 py-2 rounded-lg text-[#5D6D7E] font-medium hover:bg-gray-50 hover:text-[#1E73BE] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 flex flex-col p-3 gap-2">
            <Link
              to="/register"
              onClick={closeMenu}
              className="w-full text-left text-[#5D6D7E] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-left bg-[#1E73BE] text-white px-3 py-2 rounded-lg hover:bg-[#155d97] transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Optional darkened backdrop for mobile menu */}
      {open && (
        <button
          aria-hidden="true"
          tabIndex={-1}
          onClick={closeMenu}
          className="md:hidden fixed inset-0 z-0 bg-black/20 backdrop-blur-[1px] cursor-default"
        />
      )}
    </nav>
  );
}

export default Navbar;
