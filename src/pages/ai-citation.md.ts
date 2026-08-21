import type { APIRoute } from "astro";
import { buildAiCitationMarkdown } from "@/utils/geoText";

export const GET: APIRoute = () =>
  new Response(buildAiCitationMarkdown(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
