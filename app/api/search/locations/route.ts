import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requestUrl = new URL(
    request.nextUrl,
    `http://${request.headers.get("host")}`,
  );
  const searchTerm = requestUrl.searchParams.get("searchTerm") || "";
  const OpenCageEndpoint = "https://api.opencagedata.com/geocode/v1/json";
  const ResponsePromise = await fetch(
    `${OpenCageEndpoint}?q=${searchTerm}&key=${process.env.OPEN_CAGE_API_KEY}`,
  );
  const results = await ResponsePromise.json();

  return NextResponse.json({ results: results.results });
}
