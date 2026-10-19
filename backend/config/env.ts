// ==========================================
// Backend Environment Variables Configuration
// Server-side only: Never import into client components
// ==========================================

export const serverConfig = {
  // HeyReach API (Authorized third-party outreach provider)
  heyreach: {
    apiKey: process.env.HEYREACH_API_KEY || "",
    baseUrl: process.env.HEYREACH_BASE_URL || "https://api.heyreach.io/api/public",
  },

  // Google Gemini API (Free tier AI inference)
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    defaultModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  },

  // Firebase Admin SDK Service Account credentials
  firebaseAdmin: {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },

  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
};
