import { z } from "zod";
import processTextWithAI from "../utils/aiProcessor";
import { scrapeWebpage } from "../utils/webScraper";
import CustomResponse from "../utils/customResponse";

export async function handleTextRequest(req: Request): Promise<Response> {
  const body = await req.json();
  const textSchema = z.object({
    text: z.string().min(1),
  });

  const result = textSchema.safeParse(body);
  if (!result.success) {
    return new CustomResponse(
      { message: "Invalid input", errors: result.error.errors },
      { status: 400 }
    );
  }

  const { text } = result.data;

  try {
    const aiResponse = await processTextWithAI(text);
    return new CustomResponse({ quiz: aiResponse }, { status: 200 });
  } catch (error) {
    return new CustomResponse(
      { message: "Failed to generate quiz using AI" },
      { status: 500 }
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
    return new CustomResponse(
      { message: "Invalid input", errors: result.error.errors },
      { status: 400 }
    );
  }

  const { url } = result.data;

  try {
    const scrapedText = await scrapeWebpage(url);
    const aiResponse = await processTextWithAI(scrapedText);
    return new CustomResponse({ quiz: aiResponse }, { status: 200 });
  } catch (error) {
    return new CustomResponse(
      { message: "Failed to generate quiz using AI" },
      { status: 500 }
    );
  }
}
