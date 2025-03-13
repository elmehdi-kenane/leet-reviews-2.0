import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const sessionId = req.cookies.get("auth_session")?.value;

  if (!sessionId) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
  console.log("================ 1 ================");
  console.log("req.nextUrl.origin", req.nextUrl.origin);
  try {
    const validateRes = await fetch(
      `${req.nextUrl.origin}/api/auth/validate-session`,
      {
        headers: { Cookie: `auth_session=${sessionId}` },
        cache: "no-store",
      },
    );
    console.log("================ 2 ================");
    console.log("validateRes status:", validateRes.status);
    console.log("validateRes headers:", validateRes.headers);
    const { authenticated } = await validateRes.json();
    console.log("================ 3 ================");
    if (!authenticated) {
      const response = NextResponse.redirect(new URL("/auth/sign-in", req.url));
      response.cookies.delete("auth_session");
      return response;
    }
  } catch (error) {
    console.error("Fetch error in middleware:", error);
  }
  console.log("================ 4 ================");

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/profile/:path*", "/settings/:path*"],
};
