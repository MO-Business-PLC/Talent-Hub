import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const role = useMemo(() => {
    const r = (params.get("role") || "").toLowerCase();
    return r === "employer" ? "employer" : r === "employee" ? "employee" : "";
  }, [params]);

  useEffect(() => {
    if (role) {
      try {
        sessionStorage.setItem("role_hint", role);
      } catch {}
      // Remove the query param so refresh keeps a clean URL
      const clean = new URL(window.location.href);
      clean.searchParams.delete("role");
      clean.searchParams.delete("sso");
      if (window.location.search !== clean.search) {
        navigate(`${clean.pathname}${clean.search}${clean.hash}`, {
          replace: true,
        });
      }
    }
  }, [role]);

  return (
    <>
      {role && (
        <div className="w-full bg-blue-50 text-blue-700 text-sm py-2 text-center">
          Signed in as{" "}
          <strong className="font-semibold capitalize">{role}</strong>
        </div>
      )}
      <Welcome />
    </>
  );
}
