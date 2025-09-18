import User from "../models/User.js";
import { generateTokens, verifyToken } from "../utils/jwt.js";
import { OAuth2Client } from "google-auth-library";
import { randomBytes } from "crypto";
import dotenv from "dotenv";

dotenv.config();

// --- Google OAuth helpers ---
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const IS_DEV = (process.env.NODE_ENV || "development") !== "production";

const logGoogle = (...args) => console.log("[auth][google]", ...args);

function base64urlEncode(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  cookieHeader.split(";").forEach((part) => {
    const [k, ...rest] = part.trim().split("=");
    out[decodeURIComponent(k)] = decodeURIComponent(rest.join("="));
  });
  return out;
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const normalizedRole =
      role === "employer" || role === "admin" ? role : "employee";

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: normalizedRole,
    });

    const tokens = generateTokens(user);
    const safeUser = user.toJSON();

    // Log success (sanitized)
    try {
      const userId = safeUser._id;
      console.log("[auth] register success", {
        userId,
        email: safeUser.email,
        role: safeUser.role,
        ip: req.ip,
        time: new Date().toISOString(),
      });
    } catch {}

    const redirectTo = `/?role=${safeUser.role}`;
    return res.status(201).json({ user: safeUser, ...tokens, redirectTo });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Email already in use" });
    }
    if (err?.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/auth/refresh
export const refresh = async (req, res) => {
  try {
    // Accept refresh token from JSON body or cookie
    const cookies = parseCookies(req.headers?.cookie || "");
    const bodyToken = req.body?.refreshToken;
    const cookieToken = cookies["refreshToken"];
    const provided = bodyToken || cookieToken;

    if (!provided) {
      return res.status(400).json({ error: "Missing refresh token" });
    }

    let decoded;
    try {
      decoded = verifyToken(provided);
    } catch (e) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const tokens = generateTokens(user);
    const safeUser = user.toJSON();

    // If client is using cookie mode, refresh cookies too
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    if (cookieToken) {
      res.cookie("accessToken", tokens.accessToken, cookieOpts);
      res.cookie("refreshToken", tokens.refreshToken, cookieOpts);
    }

    return res.status(200).json({ user: safeUser, ...tokens });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    // Accept email and password from either body or query parameters
    const email = req.body?.email || req.query?.email;
    const password = req.body?.password || req.query?.password;

    console.log('POST Login attempt:', { email, password: password ? '***' : 'missing' });

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('User found:', user ? 'Yes' : 'No', user ? user.email : 'N/A');
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const tokens = generateTokens(user);
    const safeUser = user.toJSON();

    const redirectTo = `/?role=${safeUser.role}`;
    return res.status(200).json({ user: safeUser, ...tokens, redirectTo });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET login endpoint for easy URL-based login
export const loginGet = async (req, res) => {
  try {
    const { email, password } = req.query;

    console.log('Login attempt:', { email, password: password ? '***' : 'missing' });

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('User found:', user ? 'Yes' : 'No', user ? user.email : 'N/A');
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const tokens = generateTokens(user);
    const safeUser = user.toJSON();

    const redirectTo = `/?role=${safeUser.role}`;
    return res.status(200).json({ user: safeUser, ...tokens, redirectTo });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/auth/google/start
export const googleStart = async (req, res) => {
  try {
    // Accept only allowed roles; default to "employee"
    const rawRole = (req.query.role || "employee").toString();
    const role = rawRole === "employer" ? "employer" : "employee";
    const csrf = randomBytes(16).toString("hex");
    const state = base64urlEncode({ csrf, role });

    // Store CSRF in a short-lived httpOnly cookie (5 minutes)
    res.cookie("sso_csrf", csrf, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000,
      path: "/",
    });

    const authUrl = googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
      state,
      redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
    });
    logGoogle("start -> redirecting to Google", {
      role,
      redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
      frontend: FRONTEND_URL,
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    });
    return res.redirect(authUrl);
  } catch (err) {
    console.error("[auth][google] start failed:", err);
    return res.status(500).json({ error: "Failed to initiate Google sign-in" });
  }
};

// GET /api/auth/google/callback
export const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query || {};
    if (!code || !state) {
      return res.status(400).send("Missing code/state");
    }

    // Verify state with csrf cookie
    const cookies = parseCookies(req.headers?.cookie || "");
    const csrfCookie = cookies["sso_csrf"];
    let parsedState = {};
    try {
      const json = Buffer.from(
        state.toString().replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString();
      parsedState = JSON.parse(json);
    } catch {}

    if (!csrfCookie || parsedState.csrf !== csrfCookie) {
      logGoogle("callback -> invalid CSRF", {
        csrfCookie: !!csrfCookie,
        parsedState,
      });
      return res.status(400).send("Invalid CSRF state");
    }

    // Exchange code -> tokens
    let tokens;
    try {
      const t = await googleClient.getToken({
        code: code.toString(),
        redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
      });
      tokens = t.tokens;
      logGoogle("callback -> token exchange success", {
        hasIdToken: !!tokens.id_token,
        hasAccessToken: !!tokens.access_token,
      });
    } catch (ex) {
      console.error("[auth][google] token exchange failed:", ex?.message || ex);
      return res
        .status(401)
        .send(
          IS_DEV
            ? `Google sign-in failed: token exchange`
            : "Google sign-in failed"
        );
    }

    // Verify ID token and get profile
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
      logGoogle("callback -> id_token verified", {
        hasEmail: !!payload?.email,
        subPrefix: payload?.sub ? String(payload.sub).slice(0, 6) : undefined,
      });
    } catch (ex) {
      console.error(
        "[auth][google] id_token verify failed:",
        ex?.message || ex
      );
      return res
        .status(401)
        .send(
          IS_DEV
            ? `Google sign-in failed: id_token verify`
            : "Google sign-in failed"
        );
    }
    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified,
    } = payload || {};
    if (!email || !googleId) {
      logGoogle("callback -> missing email or sub", {
        hasEmail: !!email,
        hasSub: !!googleId,
      });
      return res.status(400).send("Invalid Google token");
    }

    // Upsert user by email
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const roleFromState =
        parsedState.role === "employer" ? "employer" : "employee";
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: randomBytes(16).toString("hex"), // placeholder, never used
        role: roleFromState,
      });
      logGoogle("callback -> created new user", {
        email: normalizedEmail,
        role: user.role,
      });
    }

    const tokensOut = generateTokens(user);
    logGoogle("callback -> issuing app tokens", { userId: String(user._id) });

    // Option A: httpOnly cookies + redirect
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("accessToken", tokensOut.accessToken, cookieOpts);
    res.cookie("refreshToken", tokensOut.refreshToken, cookieOpts);

    // Clear CSRF cookie
    res.clearCookie("sso_csrf", { path: "/" });

    // Redirect user to home with role for now. Later, switch to role dashboards.
    const roleDest = `/?role=${user.role}&sso=ok`;
    logGoogle("callback -> success, redirecting to frontend", {
      redirect: `${FRONTEND_URL}${roleDest}`,
    });
    return res.redirect(`${FRONTEND_URL}${roleDest}`);
  } catch (err) {
    console.error("[auth][google] callback failed:", err?.message || err);
    return res
      .status(401)
      .send(
        IS_DEV
          ? `Google sign-in failed: ${err?.message || err}`
          : "Google sign-in failed"
      );
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
