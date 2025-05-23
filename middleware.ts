import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const sessionId = req.cookies.get("auth_session")?.value;

  if (!sessionId) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
  try {
    const validateRes = await fetch(
      `${req.nextUrl.origin}/api/auth/validate-session`,
      {
        headers: { Cookie: `auth_session=${sessionId}` },
        cache: "no-store",
      },
    );
    const { authenticated } = await validateRes.json();
    if (!authenticated) {
      const response = NextResponse.redirect(new URL("/auth/sign-in", req.url));
      response.cookies.delete("auth_session");
      return response;
    }
  } catch (error) {
    console.error("Fetch error in middleware:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/profile/:path*", "/settings/:path*"],
};
