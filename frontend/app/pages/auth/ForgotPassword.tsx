// ForgotPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateEmail(value: string) {
    if (!value.trim()) return "Email is required";
    const re = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!re.test(value.trim())) return "Enter a valid email address";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement API call to send verification code
      // await postJson("/api/auth/forgot-password", { email: email.trim() });
      
      // Navigate to verification screen with email
      navigate("/verify-email", { state: { email: email.trim() } });
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-4 text-gray-600">
            Just drop your email here to reset your password!
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
