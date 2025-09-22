// routes/root-redirect.tsx
import { useEffect, useState } from "react";
import { redirect } from "react-router";

// Server-side loader function
export async function loader({ request }: { request: Request }) {
  // Check for authentication via cookies (works on server)
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [key, ...value] = cookie.split("=");
      return [key, value.join("=")];
    })
  );

  const accessToken = cookies.accessToken;
  const refreshToken = cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    // return redirect("/register");
  }

  // Try to get user role from cookies
  const userRole = cookies.userRole;

  if (userRole === "admin") {
    return redirect("/admin-dashboard");
  } else if (userRole === "employee") {
    return redirect("/employee-dashboard");
  } else if (userRole === "employer") {
    return redirect("/employer/dashboard");
  }

  // If no role found but user is authenticated, try to fetch profile
  try {
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (response.ok) {
      const profile = await response.json();
      const role = profile.role || profile.user?.role;

      if (role === "admin") {
        return redirect("/admin-dashboard");
      } else if (role === "employee") {
        return redirect("/employee-dashboard");
      } else if (role === "employer") {
        return redirect("/employer/dashboard");
      }
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }

  // Fallback redirect
  return redirect("/home");
}

// Client component
export default function RootRedirect() {
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Client-side authentication check
    const checkAuthAndRedirect = () => {
      // Safe localStorage access with error handling
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let userRole: string | null = null;

      try {
        accessToken = localStorage.getItem("accessToken");
        refreshToken = localStorage.getItem("refreshToken");
        userRole = localStorage.getItem("userRole");
      } catch (error) {
        console.log("localStorage not available, using cookies");
        // Fallback to cookies if localStorage isn't available
        const cookies = Object.fromEntries(
          document.cookie.split("; ").map((cookie) => {
            const [key, ...value] = cookie.split("=");
            return [key, value.join("=")];
          })
        );
        accessToken = cookies.accessToken || null;
        refreshToken = cookies.refreshToken || null;
        userRole = cookies.userRole || null;
      }

      if (!accessToken && !refreshToken) {
        setRedirectPath("/register");
        return;
      }

      // Redirect based on role
      if (userRole === "admin") {
        setRedirectPath("/admin-dashboard");
      } else if (userRole === "employee") {
        setRedirectPath("/employee-dashboard");
      } else if (userRole === "employer") {
        setRedirectPath("/employer/dashboard");
      } else {
        fetchUserProfile();
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const profile = await response.json();
          const role = profile.role || profile.user?.role;

          // Store role in localStorage for future use
          try {
            localStorage.setItem("userRole", role);
          } catch (error) {
            console.log("Could not store role in localStorage");
          }

          if (role === "admin") {
            setRedirectPath("/admin-dashboard");
          } else if (role === "employee") {
            setRedirectPath("/employee-dashboard");
          } else if (role === "employer") {
            setRedirectPath("/employer/dashboard");
          } else {
            setRedirectPath("/home");
          }
        } else {
          setRedirectPath("/home");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setRedirectPath("/home");
      }
    };

    // Check auth after a brief delay to allow server redirect to happen first
    const timer = setTimeout(checkAuthAndRedirect, 100);
    return () => clearTimeout(timer);
  }, []);

  // Perform the redirect once we've determined the path
  useEffect(() => {
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  }, [redirectPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Talent Hub</h2>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            If you're not redirected automatically, check your browser's console
            for any issues.
          </p>
        </div>
      </div>
    </div>
  );
}
