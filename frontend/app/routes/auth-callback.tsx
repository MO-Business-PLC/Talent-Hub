import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getJson } from "../lib/api";
import { setTokens } from "../lib/auth";

export default function AuthCallbackRoute() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");

        if (accessToken) {
          // Token-in-query mode (less secure, but sometimes used in dev)
          setTokens(accessToken, refreshToken || undefined);
          navigate("/", { replace: true });
          return;
        }

        // Cookie (httpOnly) mode: just verify by calling profile
        await getJson(`/api/auth/profile`);
        navigate("/", { replace: true });
      } catch (e: any) {
        setError(e?.message || "Authentication failed. Please try again.");
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {!error ? (
          <>
            <div className="animate-pulse text-sm text-gray-600">Finishing sign in…</div>
          </>
        ) : (
          <>
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-base px-4 py-2 text-white"
            >
              Back to Register
            </a>
          </>
        )}
      </div>
    </div>
  );
}
