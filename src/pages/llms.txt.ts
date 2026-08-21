import type { APIRoute } from "astro";
import { buildLlmsTxt } from "@/utils/geoText";

export const GET: APIRoute = () =>
  new Response(buildLlmsTxt(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
