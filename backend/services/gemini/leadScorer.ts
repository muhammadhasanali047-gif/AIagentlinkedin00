import { geminiService } from "./client";
import {
  buildLeadQualificationPrompt,
  LeadQualificationInput,
  LeadQualificationOutput,
} from "./prompts";

export async function scoreLeadWithGemini(
  input: LeadQualificationInput
): Promise<LeadQualificationOutput> {
  // Pre-check for prohibited keywords
  const lowerTitle = input.title.toLowerCase();
  const hasProhibited = input.icpSettings.prohibitedKeywords.some((pk) =>
    lowerTitle.includes(pk.toLowerCase().trim())
  );

  if (hasProhibited) {
    return {
      score: 20,
      passedThreshold: false,
      explanation: `Pre-check filter: Prospect title '${input.title}' contains a prohibited keyword. Excluded per ICP safety guidelines.`,
      connectionNoteDraft: "",
      followUpDraft: "",
    };
  }

  const { systemPrompt, userPrompt } = buildLeadQualificationPrompt(input);

  try {
    const aiOutput = await geminiService.generateJson<LeadQualificationOutput>(
      userPrompt,
      systemPrompt
    );

    // Guardrail: Ensure note draft is strictly under 300 characters
    let cleanNote = aiOutput.connectionNoteDraft || "";
    if (cleanNote.length > 290) {
      cleanNote = cleanNote.slice(0, 287).trim() + "...";
    }

    return {
      score: Math.min(100, Math.max(0, Math.round(aiOutput.score || 70))),
      passedThreshold: (aiOutput.score || 70) >= input.icpSettings.minScoreThreshold,
      explanation: aiOutput.explanation || "Evaluated by Gemini AI against Ideal Customer Profile.",
      connectionNoteDraft: cleanNote,
      followUpDraft: aiOutput.followUpDraft || "",
    };
  } catch (err: any) {
    console.warn("Gemini lead scoring fallback triggered:", err?.message);
    // Graceful degradation when quota limit reached or transient API error
    const titleMatch = input.icpSettings.targetJobTitles.some((t) =>
      lowerTitle.includes(t.toLowerCase().trim())
    );
    const fallbackScore = titleMatch ? 85 : 60;

    return {
      score: fallbackScore,
      passedThreshold: fallbackScore >= input.icpSettings.minScoreThreshold,
      explanation: `Deterministic Fallback (${err?.message || "Quota Guard"}): Role alignment based on target title evaluation.`,
      connectionNoteDraft: `Hi ${input.name.split(" ")[0]}, noticed your leadership at ${input.company}. Really admire your team's work. Would love to connect and follow your updates!`,
      followUpDraft: `Hi ${input.name.split(" ")[0]}, thanks for connecting! We put together a short architectural breakdown on reducing async workflow latency. Happy to share if relevant!`,
    };
  }
}
