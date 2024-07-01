import { z } from "zod";
import CustomResponse from "../utils/customResponse";
import processTextWithAI from "../utils/aiProcessor";

export async function handleTextRequest(req: Request) {
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

  const aiResponse = await processTextWithAI(text);

  return new CustomResponse({ message: aiResponse }, { status: 200 });
}
