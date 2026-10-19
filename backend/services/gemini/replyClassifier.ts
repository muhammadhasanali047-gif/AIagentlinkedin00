import { geminiService } from "./client";
import {
  buildReplyClassificationPrompt,
  ReplyClassificationInput,
  ReplyClassificationOutput,
} from "./prompts";

export async function classifyReplyWithGemini(
  input: ReplyClassificationInput
): Promise<ReplyClassificationOutput> {
  const { systemPrompt, userPrompt } = buildReplyClassificationPrompt(input);

  try {
    const aiOutput = await geminiService.generateJson<ReplyClassificationOutput>(
      userPrompt,
      systemPrompt
    );

    return {
      classification: aiOutput.classification || "other",
      confidence: Math.min(100, Math.max(0, Math.round(aiOutput.confidence || 90))),
      reason: aiOutput.reason || "Classified based on message semantics.",
      suggestedResponse: aiOutput.suggestedResponse || "Thank you for getting back to me!",
      actionRequired: aiOutput.actionRequired || "none",
    };
  } catch (err: any) {
    console.warn("Gemini reply classification fallback triggered:", err?.message);
    const lowerText = input.incomingText.toLowerCase();

    let classification: ReplyClassificationOutput["classification"] = "other";
    let actionRequired: ReplyClassificationOutput["actionRequired"] = "none";
    let suggestedResponse = "Thank you for getting back to me!";

    if (
      lowerText.includes("remove") ||
      lowerText.includes("unsubscribe") ||
      lowerText.includes("not interested") ||
      lowerText.includes("stop")
    ) {
      classification = "not_interested";
      actionRequired = "suppress_contact";
      suggestedResponse = "Understood. You have been removed from our list. Wishing you the best!";
    } else if (
      lowerText.includes("call") ||
      lowerText.includes("meeting") ||
      lowerText.includes("schedule") ||
      lowerText.includes("calendar") ||
      lowerText.includes("demo")
    ) {
      classification = "meeting_request";
      actionRequired = "schedule_meeting";
      suggestedResponse =
        "Glad to connect! Feel free to pick a time on my calendar: https://cal.com/hassan-ai/15min, or let me know what day works best for you.";
    } else if (lowerText.includes("?")) {
      classification = "question";
      actionRequired = "send_response";
      suggestedResponse = "Great question! Let me pull together the details and get right back to you.";
    } else if (lowerText.includes("out of the office") || lowerText.includes("ooo")) {
      classification = "out_of_office";
      actionRequired = "pause_sequence";
      suggestedResponse = "";
    } else {
      classification = "interested";
      actionRequired = "send_response";
      suggestedResponse = "Thanks for following up! Happy to share our technical overview.";
    }

    return {
      classification,
      confidence: 85,
      reason: `Rule-based Fallback (${err?.message || "Quota Guard"}): Detected keyword pattern in message.`,
      suggestedResponse,
      actionRequired,
    };
  }
}
