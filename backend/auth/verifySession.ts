// ==========================================
// Server-side Session Token Verification
// Protects API endpoints using Firebase Admin SDK
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../firebase/admin";
import { DecodedIdToken } from "firebase-admin/auth";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
}

/**
 * Verifies the Firebase ID token in the Authorization header.
 * Returns decoded token or null if unauthenticated.
 */
export async function verifyAuthToken(req: NextRequest): Promise<DecodedIdToken | null> {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1]?.trim();
    if (!token) return null;

    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (err: unknown) {
    // Never print token strings in error logs
    console.error("Session token verification failed: Invalid or expired token.");
    return null;
  }
}

/**
 * Middleware helper for protected API routes.
 * Returns unauthorized 401 response if user is not verified.
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ user: DecodedIdToken } | { errorResponse: NextResponse }> {
  const user = await verifyAuthToken(req);

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "A valid Firebase session token is required to access this resource.",
        },
        { status: 401 }
      ),
    };
  }

  return { user };
}
