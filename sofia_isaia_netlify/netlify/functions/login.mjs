import { checkCredentials, configured, issueToken, json } from "../lib/auth.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  if (!configured()) return json({ error: "Falta configurar ADMIN_USER, ADMIN_PASSWORD y AUTH_SECRET en Netlify." }, 500);
  let body = {};
  try { body = await req.json(); } catch {}
  if (!checkCredentials(body.user, body.pass)) {
    await new Promise((r) => setTimeout(r, 800)); // slows down password guessing
    return json({ error: "Usuario o contraseña incorrectos." }, 401);
  }
  return json({ token: issueToken() });
};

export const config = { path: "/api/login" };
