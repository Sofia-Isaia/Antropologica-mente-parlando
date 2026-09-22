import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { isAdmin, json } from "../lib/auth.mjs";

const TYPES = ["image/jpeg", "image/png", "image/webp"];

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  if (!isAdmin(req)) return json({ error: "Sesión caducada. Vuelve a entrar." }, 401);
  const type = (req.headers.get("content-type") || "").split(";")[0];
  if (!TYPES.includes(type)) return json({ error: "Usa una imagen JPG, PNG o WebP." }, 400);
  const data = await req.arrayBuffer();
  if (data.byteLength > 4 * 1024 * 1024) return json({ error: "La imagen pesa más de 4 MB." }, 400);
  const k = crypto.randomUUID();
  await getStore({ name: "images", consistency: "strong" }).set(k, data, { metadata: { contentType: type } });
  return json({ url: "/api/img?k=" + k });
};

export const config = { path: "/api/upload" };
