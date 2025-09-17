import { useState } from "react";
import { useNavigate } from "react-router";
import { API_BASE_URL, postJson } from "../../lib/api";
import { setTokens } from "../../lib/auth";
import { LeftHero } from "../../components/LeftHero";

// Map UI roles to backend roles (keep Employee as 'employee' per requirement)
const ROLE_MAP: Record<string, "employee" | "employer"> = {
  Employee: "employee",
  Employer: "employer",
};

const ROLE_ICONS: Record<
  "Employee" | "Employer",
  { active: string; inactive: string }
> = {
  Employee: {
    active: "/icons/auth/employeewhite.png",
    inactive: "/icons/auth/employeeinactive.png",
  },
  Employer: {
    active: "/icons/auth/employerwhite.png",
    inactive: "/icons/auth/employerinactive.png",
  },
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
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    agree?: string;
  }>({});

  function validateName(value: string) {
    if (!value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  }

  function handleGoogleSignUp() {
    const role = ROLE_MAP[roleTab];
    window.location.href = `${API_BASE_URL}/api/auth/google/start?role=${encodeURIComponent(
      role
    )}`;
  }

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

  function validateAll() {
    const errs = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      agree: agree ? "" : "You must agree to the Terms and Privacy Policy",
    } as const;
    const cleaned: any = {};
    (Object.keys(errs) as Array<keyof typeof errs>).forEach((k) => {
      if (errs[k]) cleaned[k] = errs[k];
    });
    setFieldErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateAll()) return;

    try {
      setLoading(true);
      const data = await postJson<{
        user: any;
        accessToken: string;
        refreshToken: string;
        redirectTo?: string;
      }>("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: ROLE_MAP[roleTab],
      });

      // Store tokens (localStorage or cookies depending on config)
      setTokens(data.accessToken, data.refreshToken);

      const fallback = `/?role=${ROLE_MAP[roleTab]}`;
      navigate(data.redirectTo || fallback, { replace: true });
    } catch (err: any) {
      let message = "Registration failed";
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

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left visual panel */}
      <LeftHero />

      {/* Right form panel */}
      <div className="flex justify-center items-center py-8 md:py-16 px-3 md:px-10 bg-white">
        <div className="w-full max-w-md mx-auto bg-white md:bg-transparent rounded-2xl md:rounded-none shadow md:shadow-none p-6 md:p-0 border border-gray-100 md:border-none">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-4">
            <img src="/images/auth/logo.png" alt="TalentHub" className="h-8" />
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-6 md:mb-8 text-center md:text-left">
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
                      <img
                        src={
                          active
                            ? ROLE_ICONS[tab].active
                            : ROLE_ICONS[tab].inactive
                        }
                        alt={tab}
                        className="w-5 h-5"
                      />
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
                onBlur={() =>
                  setFieldErrors((p) => ({
                    ...p,
                    name: validateName(name) || undefined,
                  }))
                }
                className="w-full rounded-md text-sm text-black border border-gray-300 px-4 py-3 outline-none bg-white focus:bg-light-gray focus:border-base focus:border-[2px] focus:ring-0"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-black mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() =>
                  setFieldErrors((p) => ({
                    ...p,
                    email: validateEmail(email) || undefined,
                  }))
                }
                className="w-full text-sm text-black rounded-md border border-gray-300 px-4 py-3 outline-none bg-white focus:bg-light-gray focus:border-base focus:border-[2px] focus:ring-0"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-black mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() =>
                  setFieldErrors((p) => ({
                    ...p,
                    password: validatePassword(password) || undefined,
                  }))
                }
                className="w-full text-sm text-black rounded-md border border-gray-300 px-4 py-3 outline-none bg-white focus:bg-light-gray focus:border-base focus:border-[2px] focus:ring-0"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.password}
                </p>
              )}
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
            {fieldErrors.agree && (
              <p className="-mt-2 text-xs text-red-600">{fieldErrors.agree}</p>
            )}

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
              onClick={handleGoogleSignUp}
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
