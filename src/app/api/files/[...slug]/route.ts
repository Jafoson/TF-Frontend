import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
    const isDev = process.env.NODE_ENV === 'development'
    const backendUrl = process.env.API_URL || (isDev ? 'http://localhost:8080' : 'https://api.tournamentfox.com')

    console.log("BACKEND URL", backendUrl + "/api/files/" + resolvedParams.slug.join("/"));
  const res = await fetch(backendUrl + "/api/files/" + resolvedParams.slug.join("/"));

  if (!res.ok) {
    return new NextResponse("Fehler beim Laden", { status: res.status });
  }

  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const buffer = await res.arrayBuffer();

  console.log("RESPONSE", res);

  return new NextResponse(buffer, {
    headers: { "Content-Type": contentType },
  });
}
