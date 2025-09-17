import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Gate route decides: if authenticated -> Home, else -> render Register
  index("routes/index.tsx"),
  // Callback route for OAuth providers
  route("/auth/callback", "routes/auth-callback.tsx"),
  // Login page
  route("/login", "routes/login.tsx"),
  // Explicit register page
  route("/register", "routes/register.tsx"),
  // Explicit home route for redirects
  route("/home", "routes/home.tsx"),
] satisfies RouteConfig;
