// EmailVerification.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = location.state?.email || "hmio15577@gmail.com";

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement API call to verify code
      // await postJson("/api/auth/verify-reset-code", { 
      //   email, 
      //   code: verificationCode 
      // });
      
      // Navigate to reset password screen
      navigate("/reset-password", { 
        state: { email, token: verificationCode } 
      });
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      // TODO: Implement API call to resend code
      // await postJson("/api/auth/resend-verification", { email });
      alert("Verification code sent!");
    } catch (err: any) {
      alert(err.message || "Failed to resend code");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="mt-4 text-gray-600">
            Hey! We just sent an activation number to
          </p>
          <p className="mt-2 font-medium text-gray-900">{email}</p>
          <p className="mt-1 text-gray-600">to help you reset your password.</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 text-center">Verification Code</h2>
          
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify My Account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Didn't get the verification code?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
