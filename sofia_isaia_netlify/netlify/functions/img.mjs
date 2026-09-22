import { getStore } from "@netlify/blobs";

export default async (req) => {
  const k = new URL(req.url).searchParams.get("k") || "";
  if (!/^[0-9a-f-]{36}$/.test(k)) return new Response("Not found", { status: 404 });
  const res = await getStore("images").getWithMetadata(k, { type: "arrayBuffer" });
  if (!res || !res.data) return new Response("Not found", { status: 404 });
  return new Response(res.data, {
    headers: {
      "content-type": res.metadata?.contentType || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

export const config = { path: "/api/img" };
