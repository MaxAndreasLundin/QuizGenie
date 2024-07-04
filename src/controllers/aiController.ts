import { z } from "zod";
import processTextWithAI from "../utils/aiProcessor";
import { scrapeWebpage } from "../utils/webScraper";
import { JsonResponse } from "../utils/customResponse";

const textSchema = z.object({
  text: z.string().min(1, "Text must not be empty"),
});

const urlSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

async function handleAIProcessing(text: string): Promise<JsonResponse> {
  try {
    const aiResponse = await processTextWithAI(text);
    return new JsonResponse({ quiz: aiResponse }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error processing text with AI:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to generate quiz using AI";
    return new JsonResponse({ message: errorMessage }, { status: 500 });
  }
}

async function validateAndParseBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new JsonResponse(
      { message: "Invalid input", errors: result.error.errors },
      { status: 400 }
    );
  }
  return result.data;
}

export async function generateQuizFromText(req: Request): Promise<Response> {
  try {
    const { text } = await validateAndParseBody(req, textSchema);
    return await handleAIProcessing(text);
  } catch (error: unknown) {
    console.error("Error in generateQuizFromText:", error);
    if (error instanceof JsonResponse) {
      return error;
    }
    return new JsonResponse(
      { message: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function generateQuizFromUrl(req: Request): Promise<Response> {
  try {
    const { url } = await validateAndParseBody(req, urlSchema);
    const scrapedText = await scrapeWebpage(url);
    return await handleAIProcessing(scrapedText);
  } catch (error: unknown) {
    console.error("Error in generateQuizFromUrl:", error);
    if (error instanceof JsonResponse) {
      return error;
    }
    return new JsonResponse(
      { message: "Failed to process request" },
      { status: 500 }
    );
  }
}
