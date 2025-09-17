import { useState } from "react";
import { useNavigate } from "react-router";
import { postJson } from "../../lib/api";
import { LeftHero } from "./components/LeftHero";

function EmployeeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" strokeWidth="1.6" />
      <path
        d="M3 21a8.5 8.5 0 0 1 18 0"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmployerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      <path d="M3 21h18" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="5" y="6" width="6" height="10" rx="1.5" strokeWidth="1.6" />
      <rect x="13" y="3" width="6" height="13" rx="1.5" strokeWidth="1.6" />
      <path
        d="M7.5 8.5h1M7.5 11.5h1M15.5 5.5h1M15.5 8.5h1M15.5 11.5h1"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Map UI roles to backend roles
const ROLE_MAP: Record<string, "applicant" | "employer"> = {
  Employee: "applicant",
  Employer: "employer",
};

export default function Register() {
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState<"Employee" | "Employer">("Employee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Full Name, Email and Password are required");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms of Use and Privacy Policy");
      return;
    }

    try {
      setLoading(true);
      const data = await postJson<{
        user: any;
        accessToken: string;
        refreshToken: string;
      }>("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: ROLE_MAP[roleTab],
      });

      // Store tokens (can be replaced with httpOnly cookie strategy later)
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Redirect after success
      navigate("/", { replace: true });
    } catch (err: any) {
      try {
        const parsed = err instanceof Response ? await err.json() : null;
        setError(parsed?.error || "Registration failed");
      } catch {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left visual panel */}
      <LeftHero />

      {/* Right form panel */}
      <div className="flex items-start justify-center py-16 px-4 md:px-10 bg-white">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-4xl font-semibold text-black mb-8">
            Create Account
          </h1>

          {/* Role toggle */}
          <div className="mb-8">
            <div className="bg-surface rounded-xl p-6 w-full">
              <div className="text-center text-xs tracking-wide text-gray-500 mb-3">
                CREATE ACCOUNT AS
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["Employee", "Employer"] as const).map((tab) => {
                  const active = roleTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRoleTab(tab)}
                      className={
                        "h-12 w-full inline-flex items-center justify-center gap-3 rounded-[12px] transition-colors px-6 " +
                        (active
                          ? "bg-base text-white"
                          : "bg-white text-gray-700")
                      }
                    >
                      {tab === "Employee" ? (
                        <EmployeeIcon
                          className={
                            "w-5 h-5" +
                            (active ? " text-white" : " text-gray-500")
                          }
                        />
                      ) : (
                        <EmployerIcon
                          className={
                            "w-5 h-5" +
                            (active ? " text-white" : " text-gray-500")
                          }
                        />
                      )}
                      <span className="font-semibold">{tab}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-black mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-6 py-3 outline-none bg-white focus:bg-light-gray focus:border-base focus:border-[2px] focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-sm text-black mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-6 py-3 outline-none bg-white focus:bg-light-gray focus:border-base focus:border-[2px] focus:ring-0"
              />
            </div>
            <div>
              <label className="block text-sm text-black mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-6 py-3 outline-none bg-white focus:bg-light-gray focus:border-base focus:border-[2px] focus:ring-0"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border border-gray-300 bg-light-gray accent-base [color-scheme:light] focus:ring-0"
              />
              <span>
                I agree with{" "}
                <a className="text-base hover:underline" href="#">
                  Terms of Use
                </a>{" "}
                and
                <span> </span>
                <a className="text-base hover:underline" href="#">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-base text-white rounded-lg py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-70 transition-colors"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="flex items-center gap-3 text-[11px] tracking-wide text-gray-400 select-none">
              <div className="h-px bg-gray-200 flex-1" />
              <span>OR</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-light-gray rounded-md py-3"
            >
              <img
                src="/icons/auth/google.png"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-black font-medium text-sm">
                Sign Up With Google
              </span>
            </button>

            <p className="text-sm text-black text-center">
              Already have an account?{" "}
              <a href="/login" className="text-[#1E73BE] hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
