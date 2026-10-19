import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/backend/auth/verifySession";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);

  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const user = authResult.user;

  return NextResponse.json({
    success: true,
    user: {
      uid: user.uid,
      email: user.email,
      emailVerified: user.email_verified,
      authTime: user.auth_time,
    },
  });
}
