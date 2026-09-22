import crypto from "node:crypto";

// Credentials live in Netlify environment variables, never in the code:
// ADMIN_USER, ADMIN_PASSWORD and AUTH_SECRET (a long random string).
const secret = () => process.env.AUTH_SECRET || "";
const SESSION_HOURS = 12;

function hmac(data) {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function configured() {
  return Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASSWORD && secret());
}

export function checkCredentials(user, pass) {
  if (!configured()) return false;
  const u = safeEqual(String(user || "").trim().toLowerCase(), process.env.ADMIN_USER.trim().toLowerCase());
  const p = safeEqual(String(pass || ""), process.env.ADMIN_PASSWORD);
  return u && p;
}

export function issueToken() {
  const body = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3600e3 })).toString("base64url");
  return body + "." + hmac(body);
}

export function isAdmin(req) {
  if (!configured()) return false;
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  if (!safeEqual(hmac(body), sig)) return false;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
