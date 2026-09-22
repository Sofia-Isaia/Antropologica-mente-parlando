import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { isAdmin, json } from "../lib/auth.mjs";

const store = () => getStore({ name: "blog", consistency: "strong" });
const key = (post) => "comments/" + post;
const validPost = (p) => /^[a-z0-9-]{1,80}$/.test(p || "");
const pub = (list) => list.map(({ id, name, text, at }) => ({ id, name, text, at }));

export default async (req) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const post = url.searchParams.get("post");
    if (!validPost(post)) return json({ error: "Entrada no válida." }, 400);
    const list = (await store().get(key(post), { type: "json" })) ?? [];
    // Emails are only visible to the admin.
    return json({ comments: isAdmin(req) ? list : pub(list) });
  }

  if (req.method === "POST") {
    let d = {};
    try { d = await req.json(); } catch {}
    if (d.website) return json({ comments: [] }); // honeypot: bots fill the hidden field
    const post = String(d.post || "");
    const name = String(d.name || "").trim().slice(0, 60);
    const email = String(d.email || "").trim().slice(0, 120);
    const text = String(d.text || "").trim().slice(0, 2000);
    if (!validPost(post)) return json({ error: "Entrada no válida." }, 400);
    if (!name || !text) return json({ error: "Escribe tu nombre y tu comentario." }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Revisa el correo: parece incompleto." }, 400);
    const posts = (await store().get("posts", { type: "json" })) ?? null;
    if (posts && !posts.some((p) => p.id === post)) return json({ error: "Esa entrada ya no existe." }, 404);
    const list = (await store().get(key(post), { type: "json" })) ?? [];
    const last = list.filter((c) => c.email === email).at(-1);
    if (last && Date.now() - Date.parse(last.at) < 30000) return json({ error: "Espera unos segundos antes de volver a comentar." }, 429);
    list.push({ id: crypto.randomUUID(), name, email, text, at: new Date().toISOString() });
    await store().setJSON(key(post), list.slice(-500));
    return json({ comments: pub(list) });
  }

  if (req.method === "DELETE") {
    if (!isAdmin(req)) return json({ error: "Sesión caducada. Vuelve a entrar." }, 401);
    const post = url.searchParams.get("post");
    const id = url.searchParams.get("id");
    if (!validPost(post) || !id) return json({ error: "Datos no válidos." }, 400);
    const list = ((await store().get(key(post), { type: "json" })) ?? []).filter((c) => c.id !== id);
    await store().setJSON(key(post), list);
    return json({ comments: list });
  }

  return json({ error: "Método no permitido" }, 405);
};

export const config = { path: "/api/comments" };
