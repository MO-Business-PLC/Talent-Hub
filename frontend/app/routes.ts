import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Make Register the landing page
  index("routes/register.tsx"),
  // Also expose an explicit /register path
  // route("/register", "routes/register.tsx"),
] satisfies RouteConfig;
