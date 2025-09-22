import { useState } from "react";
import { useNavigate } from "react-router";
import { API_BASE_URL, postJson } from "../../lib/api";
import { setTokens } from "../../lib/auth";
import { LeftHero } from "../../components/LeftHero";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateEmail(value: string) {
    if (!value.trim()) return "Email is required";
    const re = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!re.test(value.trim())) return "Enter a valid email address";
    return "";
  }

  function validatePassword(value: string) {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setError(emailErr || passErr);
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting login with:", { email: email.trim() });
      const data = await postJson<{
        user: any;
        accessToken: string;
        refreshToken: string;
      }>("/api/auth/login", {
        email: email.trim(),
        password,
      });
      console.log("Login successful:", {
        user: data.user,
        role: data.user?.role,
      });

      // Persist tokens
      setTokens(data.accessToken, data.refreshToken);

      // Store user role in localStorage for future use
      const userRole = data.user?.role || "employee";
      try {
        localStorage.setItem("userRole", userRole);
        // Also store keys expected by dashboard guards
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.log("Could not store role in localStorage");
      }

      // Redirect based on user role
      if (userRole === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (userRole === "employee") {
        navigate("/employee-dashboard", { replace: true });
      } else if (userRole === "employer") {
        navigate("/employer/dashboard", { replace: true });
      } else {
        // Fallback redirect
        navigate("/home", { replace: true });
      }
    } catch (err: any) {
      let message = "Login failed";
      if (err instanceof Response) {
        try {
          const parsed = await err.json();
          message = parsed?.error || message;
        } catch {}
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleAuth() {
    // Login with Google (same entry as signup, backend decides to sign-in/up)
    window.location.href = `${API_BASE_URL}/api/auth/google/start`;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left visual panel (same as register) */}
      <LeftHero />

      {/* Right form panel */}
      <div className="flex justify-center items-center py-8 md:py-16 px-3 md:px-10 bg-white">
        <div className="w-full max-w-md mx-auto bg-white md:bg-transparent rounded-2xl md:rounded-none shadow md:shadow-none p-6 md:p-0 border border-gray-100 md:border-none">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-4">
            <img src="/images/auth/logo.png" alt="TalentHub" className="h-8" />
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-2 md:mb-3 text-center md:text-left">
            Login
          </h1>
          <p className="text-sm text-gray-500 mb-6 md:mb-8 text-center md:text-left">
            Welcome back! Please log in to access your account.
          </p>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-black mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm text-black rounded-md border border-gray-300 px-4 py-3 outline-none bg-white focus:bg-light-gray focus:border-base focus:border-[2px] focus:ring-0"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm text-black">Password</label>
            
                <a 
                  href="/forgot-password" 
                  className="text-sm text-gray-500 hover:text-black"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm text-black rounded-md border border-gray-300 px-4 py-3 pr-11 outline-none bg-white focus:bg-light-gray focus:border-base focus:border-[2px] focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 grid place-items-center text-gray-500 hover:text-black"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img src="/icons/auth/eye.png" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-600 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border border-gray-300 bg-light-gray accent-base [color-scheme:light] focus:ring-0"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-base text-white rounded-lg py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-70 transition-colors"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>

            <div className="flex items-center gap-3 text-[11px] tracking-wide text-gray-400 select-none">
              <div className="h-px bg-gray-200 flex-1" />
              <span>OR</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 bg-light-gray rounded-md py-3"
            >
              <img
                src="/icons/auth/google.png"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-black font-medium text-sm">
                Sign In With Google
              </span>
            </button>

            <p className="text-sm text-black text-center">
              Don't have an account?{" "}
              <a href="/register" className="text-[#1E73BE] hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
