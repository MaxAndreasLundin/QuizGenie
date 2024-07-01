import { z } from "zod";
import processTextWithAI from "../utils/aiProcessor";

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
