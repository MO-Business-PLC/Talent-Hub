// routes/forgot-password.tsx
import ForgotPassword from "../pages/auth/ForgotPassword";

export function meta() {
  return [
    { title: "Forgot Password - Talent Hub" },
    { name: "description", content: "Reset your Talent Hub account password" },
  ];
}

export default function ForgotPasswordRoute() {
  return <ForgotPassword />;
}
