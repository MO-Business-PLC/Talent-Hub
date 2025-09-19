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
  route("/auth/callback", "routes/auth-callback.tsx"),
  // Login page
  route("/login", "routes/login.tsx"),
  // Register page
  route("/register", "routes/register.tsx"),

  // Jobs routes

  route("/employee-dashboard", "routes/employee-dashboard.tsx"),
  // Dashboard layout with nested routes
  layout("routes/dashboard-layout.tsx", [
    route("/employer-dashboard", "routes/employer-dashboard.tsx"),
    route("/post-job", "routes/post-job.tsx"),
  ]),
  // Home route (optional fallback)
  route("/jobs", "routes/jobs.tsx"),
  route("/jobs/:id", "routes/job.$id.tsx"),
  route("/job-application", "routes/job-application.tsx"),
  // Home route (optional fallback)
  route("/home", "routes/home.tsx"),
] satisfies RouteConfig;
