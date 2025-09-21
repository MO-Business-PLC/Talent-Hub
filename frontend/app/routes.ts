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

  route("/employee-dashboard", "routes/employee-dashboard.tsx"),
  // Dashboard layout with nested routes
  layout("routes/dashboard-layout.tsx", [
    route("/employer/dashboard", "routes/employer-dashboard.tsx"),
    route("/employer/jobs", "routes/employer-dashboard.tsx", {
      id: "/jobs",
    }),
    route("/employer/candidates", "routes/employer-candidates.tsx"),
    route("/post-job", "routes/post-job.tsx"),
    route("/jobs/:jobId/applicants", "routes/job-applicants.$jobId.tsx"),
  ]),
  // Home route (optional fallback)
  layout("routes/home-layout.tsx", [
    route("/home", "routes/home.tsx"),
    route("/jobs", "routes/jobs.tsx"),
    // route("/job-application", "routes/job-application.tsx"),
    route("/jobs/:id", "routes/job.$id.tsx"),
    route("/jobs/:id/apply", "routes/job-application.$id.tsx"),
  ]),
] satisfies RouteConfig;
