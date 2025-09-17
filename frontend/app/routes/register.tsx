import Register from "../features/auth/Register";

export function meta() {
  return [
    { title: "Create Account - Talent Hub" },
    { name: "description", content: "Create your Talent Hub account" },
  ];
}

export default function RegisterRoute() {
  return <Register />;
}
