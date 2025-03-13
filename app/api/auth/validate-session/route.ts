import { NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get("auth_session")?.value;
  console.log("sessionId:", sessionId);

  if (!sessionId) {
    return NextResponse.json({ authenticated: false });
  }
  console.log("after !sessionId");

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
