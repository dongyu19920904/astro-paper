import { getCollection } from "astro:content";
import { buildPublicationStatus } from "@/utils/publicationStatus";

export async function GET() {
  return Response.json(buildPublicationStatus(await getCollection("blog")));
}
