import OpenAI from "openai";
import { z } from "zod";
import { MAX_TOKENS, OPENAI_MODEL } from "../config";

const openai = new OpenAI({
  apiKey: process.env.QUIZGENIE_OPENAI_API_KEY,
});

const QuizQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const QuizResponseSchema = z.object({
  title: z.string(),
  questions: z.array(QuizQuestionSchema),
});

type QuizResponse = z.infer<typeof QuizResponseSchema>;

function truncateText(text: string, maxTokens: number): string {
  // This is a simplistic approach. Consider using a proper tokenizer.
  return text.split(" ").slice(0, maxTokens).join(" ");
}

async function getAIResponse(text: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant designed to generate quizzes based on the provided information. Answer in the same language as the text you were provided with. Format the response as a JSON object with a title and a list of questions, each with a question and an answer.",
      },
      {
        role: "user",
        content: `Generate a quiz based on the following information: ${text}`,
      },
    ],
  });

  const messageContent = completion.choices[0]?.message?.content;
  if (!messageContent) {
    throw new Error("No valid response content from AI");
  }

  return messageContent;
}

function parseAIResponse(response: string): QuizResponse {
  try {
    const parsedResponse = JSON.parse(response);
    return QuizResponseSchema.parse(parsedResponse);
  } catch (error) {
    console.error("Failed to parse or validate AI response:", error);
    throw new Error("Invalid response format from AI");
  }
}

export default async function processTextWithAI(
  text: string
): Promise<QuizResponse> {
  try {
    const truncatedText = truncateText(text, MAX_TOKENS);
    const aiResponse = await getAIResponse(truncatedText);
    return parseAIResponse(aiResponse);
  } catch (error) {
    console.error("Error in processTextWithAI:", error);
    throw new Error("Failed to generate quiz using AI");
  }
}
