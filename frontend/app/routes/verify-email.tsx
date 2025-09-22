// routes/verify-email.tsx
import EmailVerification from "../pages/auth/EmailVerification";

export function meta() {
  return [
    { title: "Email Verification - Talent Hub" },
    { name: "description", content: "Verify your email for Talent Hub account" },
  ];
}

export default function EmailVerificationRoute() {
  return <EmailVerification />;
}
