import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getJson } from "../lib/api";

export default function IndexGate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        const hintedRole = params.get("role");
        const prof = await getJson<{ user: { role?: string } }>(
          "/api/auth/profile"
        );
        const role = (prof?.user?.role as string) || hintedRole || "employee";
        navigate(`/home?role=${encodeURIComponent(role)}`, { replace: true });
      } catch (e: any) {
        navigate("/register", { replace: true });
      }
    }
    run();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-sm text-gray-600 animate-pulse">Loading…</div>
    </div>
  );
}
