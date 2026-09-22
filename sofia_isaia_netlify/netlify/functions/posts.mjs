import { getStore } from "@netlify/blobs";
import { isAdmin, json } from "../lib/auth.mjs";
import { SEED } from "../lib/seed.mjs";

const store = () => getStore({ name: "blog", consistency: "strong" });
const str = (v, max) => String(v ?? "").trim().slice(0, max);

function clean(p) {
  const body = (Array.isArray(p.body) ? p.body : String(p.body || "").split(/\n+/))
    .map((t) => str(t, 8000)).filter(Boolean).slice(0, 200);
  const id = str(p.id, 80).toLowerCase().replace(/[^a-z0-9-]/g, "");
  const img = str(p.img, 300);
  return {
    id,
    title: str(p.title, 200),
    date: /^\d{4}-\d{2}$/.test(p.date) ? p.date : "",
    cat: str(p.cat, 60),
    img: img.startsWith("/") ? img : "",
    body,
    created: Number(p.created) || Date.now(),
  };
}

export default async (req) => {
  if (req.method === "GET") {
    const posts = (await store().get("posts", { type: "json" })) ?? SEED;
    return json({ posts });
  }
  if (req.method === "PUT") {
    if (!isAdmin(req)) return json({ error: "Sesión caducada. Vuelve a entrar." }, 401);
    let data;
    try { data = await req.json(); } catch { return json({ error: "Datos no válidos." }, 400); }
    if (!Array.isArray(data.posts)) return json({ error: "Datos no válidos." }, 400);
    const posts = data.posts.map(clean).filter((p) => p.id && p.title && p.body.length);
    const ids = new Set();
    for (const p of posts) { if (ids.has(p.id)) return json({ error: "Hay dos entradas con el mismo identificador." }, 400); ids.add(p.id); }
    await store().setJSON("posts", posts);
    return json({ posts });
  }
  return json({ error: "Método no permitido" }, 405);
};

export const config = { path: "/api/posts" };
