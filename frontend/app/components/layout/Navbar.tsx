import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setOpen((o) => !o);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("user");
        const userRole = localStorage.getItem("userRole");
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        console.log("Navbar auth check:", { userStr, userRole, isAuthenticated });

        if (userStr && userRole && isAuthenticated === "true") {
          const userData = JSON.parse(userStr);
          console.log("Setting user data:", userData);
          setUser({
            name: userData.name || userData.email || "User",
            email: userData.email || "",
            role: userRole,
          });
        } else {
          console.log("No valid auth data found");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setUser(null);
      }
    };

    // Check immediately
    checkAuth();

    // Also listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "userRole" || e.key === "isAuthenticated") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as Element;
        if (!target.closest("[data-user-menu]")) {
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setShowUserMenu(false);
    navigate("/login", { replace: true });
  };

  const getDashboardPath = (role: string) => {
    switch (role) {
      case "admin":
        return "/admin-dashboard";
      case "employer":
        return "/employer/dashboard";
      case "employee":
        return "/employee-dashboard";
      default:
        return "/home";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const refreshAuth = () => {
    const userStr = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    console.log("Manual refresh:", { userStr, userRole, isAuthenticated });

    if (userStr && userRole && isAuthenticated === "true") {
      const userData = JSON.parse(userStr);
      setUser({
        name: userData.name || userData.email || "User",
        email: userData.email || "",
        role: userRole,
      });
    } else {
      setUser(null);
    }
  };
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
    <nav className="bg-white mx-10 md:mx-15 lg:mx-25 mt-5 shadow-sm rounded-xl px-4 md:px-6 py-3 flex items-center justify-between relative">
      {/* Brand */}
      <div className="flex items-center flex-shrink-0">
        <Link to={"/home"}>
        <img src="/images/auth/logo.png" alt="TalentHub" className="h-8 w-auto" />

        </Link>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
        {regularNavLinks.map((link) => (
          <Link
            to={link.url}
            key={link.name}
            className="px-2 lg:px-3 py-1 text-[#5D6D7E] font-medium hover:text-[#1E73BE] transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Desktop Auth Section */}
      <div className="hidden md:flex items-center">
        {user ? (
          <div className="relative" data-user-menu>
            {/* User Avatar */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{getUserInitials(user.name)}</span>
              </div>
              {/* <span className="text-gray-700 font-medium">{user.name}</span> */}
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <Link
                  to={getDashboardPath(user.role)}
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Settings
                </Link>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
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
          </>
        )}
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
            {regularNavLinks.map((link) => (
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
            {user ? (
              <>
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {getUserInitials(user.name)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                <Link
                  to={getDashboardPath(user.role)}
                  onClick={closeMenu}
                  className="w-full text-left text-[#5D6D7E] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="w-full text-left text-[#5D6D7E] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className="w-full text-left text-[#5D6D7E] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full text-left text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
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
