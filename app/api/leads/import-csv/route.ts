import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";
import { ImportCsvLeadsSchema } from "@/backend/schemas/leads";
import { logActivity } from "@/backend/services/auditLogger";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const parseResult = ImportCsvLeadsSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { leads } = parseResult.data;
    const userId = user?.uid || "demo_system";

    // Fetch existing suppression list
    const supSnap = await adminDb.collection("suppressionList").get();
    const suppressedValues = new Set(
      supSnap.docs.map((doc) => doc.data().value?.toLowerCase().trim())
    );

    // Fetch existing leads' LinkedIn URLs to detect duplicates
    const existingLeadsSnap = await adminDb.collection("leads").select("linkedinUrl").get();
    const existingUrls = new Set(
      existingLeadsSnap.docs.map((doc) => doc.data().linkedinUrl?.toLowerCase().trim())
    );

    const batch = adminDb.batch();
    let addedCount = 0;
    let duplicateCount = 0;
    let suppressedCount = 0;

    const leadsCollection = adminDb.collection("leads");

    for (const lead of leads) {
      const cleanUrl = lead.linkedinUrl.toLowerCase().trim();
      const isDup = existingUrls.has(cleanUrl);
      const isSuppressed =
        suppressedValues.has(lead.company.toLowerCase().trim()) ||
        suppressedValues.has(cleanUrl);

      if (isDup) {
        duplicateCount++;
      } else {
        existingUrls.add(cleanUrl);
        if (isSuppressed) suppressedCount++;

        const newDocRef = leadsCollection.doc();
        batch.set(newDocRef, {
          ...lead,
          userId,
          status: isSuppressed ? "suppressed" : "new",
          aiScore: 78,
          aiScoreExplanation: "Imported via CSV. Scheduled for Gemini ICP scoring.",
          connectionNoteDraft: "",
          followUpDraft: "",
          source: "csv_import",
          isDuplicate: false,
          suppressed: isSuppressed,
          tags: ["CSV Import", ...(lead.tags || [])],
          lastActivityAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      await batch.commit();
    }

    await logActivity({
      category: "heyreach_sync",
      severity: duplicateCount > 0 ? "warning" : "success",
      title: "Batch CSV Import Executed",
      description: `Imported ${addedCount} leads to Firestore. Duplicates skipped: ${duplicateCount}. Suppressed: ${suppressedCount}.`,
      userId,
    });

    return NextResponse.json({
      success: true,
      addedCount,
      duplicateCount,
      suppressedCount,
    });
  } catch (err: unknown) {
    console.error("POST /api/leads/import-csv error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to process batch CSV import" },
      { status: 500 }
    );
  }
}
