import { z } from "zod";
import processTextWithAI from "../utils/aiProcessor";
import { scrapeWebpage } from "../utils/webScraper";

export async function handleTextRequest(req: Request): Promise<Response> {
  const body = await req.json();
  const textSchema = z.object({
    text: z.string().min(1),
  });

  const result = textSchema.safeParse(body);
  if (!result.success) {
    return new Response(
      JSON.stringify({ message: "Invalid input", errors: result.error.errors }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { text } = result.data;

  try {
    const aiResponse = await processTextWithAI(text);
    return new Response(JSON.stringify({ quiz: aiResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to generate quiz using AI" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function handleUrlRequest(req: Request): Promise<Response> {
  const body = await req.json();
  const urlSchema = z.object({
    url: z.string().url(),
  });

  const result = urlSchema.safeParse(body);
  if (!result.success) {
    return new Response(
      JSON.stringify({ message: "Invalid input", errors: result.error.errors }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { url } = result.data;

  try {
    const scrapedText = await scrapeWebpage(url);
    const aiResponse = await processTextWithAI(scrapedText);
    return new Response(JSON.stringify({ quiz: aiResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to generate quiz using AI" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
