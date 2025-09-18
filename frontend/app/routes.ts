import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Root route redirects based on authentication and user role
  index("routes/root-redirect.tsx"),
  // Callback route for OAuth providers
  route("/auth/callback", "routes/auth-callback.tsx"),
  // Login page
  route("/login", "routes/login.tsx"),
  // Register page
  route("/register", "routes/register.tsx"),
  // Employee dashboard
  route("/employee-dashboard", "routes/employee-dashboard.tsx"),
  // Employer dashboard
  route("/employer-dashboard", "routes/employer-dashboard.tsx"),
  // Admin dashboard
  route("/admin-dashboard", "routes/admin-dashboard.tsx"),
  // Home route (optional fallback)
  route("/jobs", "routes/jobs.tsx"),
  route("/jobs/:id", "routes/job.$id.tsx"),
] satisfies RouteConfig;
