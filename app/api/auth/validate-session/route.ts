import { NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get("auth_session")?.value;

  if (!sessionId) {
    console.log(
      "!sessionId",
      "req.cookies.get(auth_session)",
      req.cookies.get("auth_session"),
    );
    return NextResponse.json({ authenticated: false });
  }

  try {
    const { session } = await lucia.validateSession(sessionId);

    if (!session) {
      console.log("session invalid");
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.log("session invalid", error);
    return NextResponse.json({ authenticated: false });
  }
}
