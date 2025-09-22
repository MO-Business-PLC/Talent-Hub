import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Root route redirects based on authentication and user role
  index("routes/root-redirect.tsx"),
  // Callback route for OAuth providers
  route("/auth-callback", "routes/auth-callback.tsx"),
  // Login page
  route("/login", "routes/login.tsx"),
  // Register page
  route("/register", "routes/register.tsx"),
  
  route("/forgot-password", "routes/forgot-password.tsx"),
  route("/verify-email", "routes/verify-email.tsx"),
  route("/reset-password", "routes/reset-password.tsx"),

  // Jobs routes

  // Admin dashboard
  route("/admin-dashboard", "routes/admin-dashboard.tsx"),

  // Employee dashboard (support both slug and legacy path)
  route("/employee/dashboard", "routes/employee-dashboard.tsx"),
  route("/employee-dashboard", "routes/employee-dashboard.tsx", {
    id: "employee-dashboard-legacy",
  }),
  // Dashboard layout with nested routes
  layout("routes/dashboard-layout.tsx", [
    route("/employer/dashboard", "routes/employer-dashboard.tsx"),
    // Alias path to support /employer-dashboard while keeping the same layout
    route("/employer-dashboard", "routes/employer-dashboard.tsx", {
      id: "employer-dashboard-legacy",
    }),
    route("/employer/jobs", "routes/employer-dashboard.tsx", {
      id: "/jobs",
    }),
    route("/employer/candidates", "routes/employer-candidates.tsx"),
    route("/employer/post-job", "routes/post-job.tsx"),
    route("/jobs/:jobId/applicants", "routes/job-applicants.$jobId.tsx"),
  ]),
  layout("routes/home-layout.tsx", [
    route("/home", "routes/home.tsx"),
    route("/about", "routes/about.tsx"),
    route("/jobs", "routes/jobs.tsx"),
    // route("/job-application", "routes/job-application.tsx"),
    route("/jobs/:id", "routes/job.$id.tsx"),
    route("/jobs/:id/apply", "routes/job-application.$id.tsx"),
  ]),
] satisfies RouteConfig;
