import Login from "../pages/auth/Login";

export function meta() {
  return [
    { title: "Login - Talent Hub" },
    { name: "description", content: "Login to your Talent Hub account" },
  ];
}

export default function LoginRoute() {
  return <Login />;
}
