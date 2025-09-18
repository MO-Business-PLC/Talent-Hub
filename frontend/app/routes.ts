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
  // Home route (optional fallback)
  route("/home", "routes/home.tsx"),
] satisfies RouteConfig;