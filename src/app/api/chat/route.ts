export const runtime = 'edge';

import { streamText, convertToModelMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Gemini API key is missing." }, { status: 500 });
    }

    const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

    // Sanitize message history to satisfy Gemini API constraints (must start with user message)
    let cleanMessages = Array.isArray(messages) ? messages : [];
    cleanMessages = cleanMessages.filter((m: { role?: string }) => m.role === 'user' || m.role === 'assistant');
    if (cleanMessages[0]?.role === 'assistant') {
      cleanMessages.shift();
    }

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      system: "You are Siya, the proprietary AI Intelligence and Lead Campaign Strategist for UGC FY. Your creator is Shubham Mishra, Founder & CEO (LinkedIn: https://www.linkedin.com/in/shubham-mishra-795083172/).\nYOUR CAPABILITIES:\n1. PLATFORM KNOWLEDGE: You know every detail of UGC FY's terms, conditions, Escrow protection, and the strict 3-POC free tier.\n2. CAMPAIGN IDEATION: If a brand asks for campaign ideas, act as an elite creative director. Provide 3 highly viral, scroll-stopping video concepts tailored to their niche.\n3. SCRIPTWRITING: If asked, generate complete 9:16 short-form video scripts. Format them cleanly with visual cues (e.g., [HOOK: 0-3s], [BODY: 3-12s], [CTA: 12-15s]).\nTONE: Brutally effective, highly professional, fast, and persuasive. Use Markdown (bolding, bullet points) to structure long responses so they are instantly scannable.",
      messages: await convertToModelMessages(cleanMessages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const err = error as Record<string, unknown> & Error;
    console.error("Chat API Route Error:", err);
    
    // Aggressive checking for 429 / Too Many Requests status or messages
    const isRateLimit = 
      err?.status === 429 || 
      err?.statusCode === 429 || 
      String(err?.message || "").includes("429") || 
      String(err?.message || "").toLowerCase().includes("too many requests") ||
      String(err || "").includes("429");

    if (isRateLimit) {
      return new Response("Siya is currently assisting a massive volume of brands. Please wait 10 seconds and try again.", { status: 429 });
    }

    return Response.json({ error: err.message || "An error occurred during generation." }, { status: 500 });
  }
}
