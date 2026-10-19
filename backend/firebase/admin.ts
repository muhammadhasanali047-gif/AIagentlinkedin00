// ==========================================
// Firebase Admin SDK Initialization
// Server-side only: Uses secure service account credentials
// ==========================================

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { serverConfig } from "../config/env";

let adminApp: App;

if (getApps().length === 0) {
  const privateKey = serverConfig.firebaseAdmin.privateKey;
  const clientEmail = serverConfig.firebaseAdmin.clientEmail;
  const projectId = serverConfig.firebaseAdmin.projectId;

  if (privateKey && clientEmail && projectId) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    // Fallback initialize for environments with application default credentials
    adminApp = initializeApp({
      projectId: projectId || "linkedin-ai-agent-a7817",
    });
  }
} else {
  adminApp = getApps()[0];
}

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);
export { adminApp };
