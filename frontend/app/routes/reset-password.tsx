// routes/reset-password.tsx
import ResetPassword from "../pages/auth/ResetPassword";

export function meta() {
  return [
    { title: "Reset Password - Talent Hub" },
    { name: "description", content: "Set new password for your Talent Hub account" },
  ];
}

export default function ResetPasswordRoute() {
  return <ResetPassword />;
}
