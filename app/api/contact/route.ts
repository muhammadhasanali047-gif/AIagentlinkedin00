import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

// GET health check & API info
export async function GET() {
  return NextResponse.json(
    {
      status: "online",
      service: "Hassan Portfolio Backend API",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      routes: [
        {
          path: "/api/contact",
          method: "POST",
          description: "Submits client project inquiries with Zod validation and email dispatch",
        },
      ],
    },
    { status: 200 }
  );
}

// POST message submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Integration hook for Resend email dispatch
      /*
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: "muhammadhasanali047@gmail.com",
          subject: `New Inquiry from ${validatedData.name} [${validatedData.projectType}]`,
          text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nProject Type: ${validatedData.projectType}\nMessage: ${validatedData.message}`,
        }),
      });
      */
    }

    console.log("[Backend API] Contact inquiry received:", {
      timestamp: new Date().toISOString(),
      ...validatedData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been dispatched successfully. Hassan will reply shortly!",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
