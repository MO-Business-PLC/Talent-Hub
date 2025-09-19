import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getJson } from "../lib/api";
import { setTokens } from "../lib/auth";

// Define the expected profile response type
interface UserProfile {
  role?: "employee" | "employer";
  // Add other expected properties if needed
  id?: string;
  email?: string;
  name?: string;
}

interface ProfileResponse {
  user?: UserProfile;
  role?: "employee" | "employer";
  // Handle other common API response patterns
  data?: UserProfile;
}

export default function AuthCallbackRoute() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        setIsLoading(true);
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");

        if (accessToken) {
          // Token-in-query mode (less secure, but sometimes used in dev)
          setTokens(accessToken, refreshToken || undefined);
        }

        // Get user profile to determine role
        const profile = await getJson<ProfileResponse>(`/api/auth/profile`);

        // Extract role from different possible response structures
        const userRole =
          profile?.role || profile?.user?.role || profile?.data?.role;

        // Redirect based on user role
        if (userRole === "employee") {
          navigate("/employee-dashboard", { replace: true });
        } else if (userRole === "employer") {
          navigate("/employer-dashboard", { replace: true });
        } else {
          // Fallback if no role is specified
          console.warn("No user role found in profile:", profile);
          navigate("/home", { replace: true });
        }
      } catch (e: any) {
        console.error("Auth callback error:", e);
        setError(e?.message || "Authentication failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-pulse text-sm text-gray-600">
            Finishing sign in…
          </div>
          <div className="mt-4">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {!error ? (
          <>
            <div className="text-sm text-gray-600">
              Authentication successful!
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Redirecting you to your dashboard...
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-base px-4 py-2 text-white hover:bg-base/90 transition-colors"
            >
              Back to Register
            </a>
            <div className="mt-3">
              <a
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Try logging in instead
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
