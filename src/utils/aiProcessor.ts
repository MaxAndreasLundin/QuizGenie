import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.QUIZGENIE_OPENAI_API_KEY,
});

interface QuizQuestion {
  question: string;
  answer: string;
}

interface QuizResponse {
  title: string;
  questions: QuizQuestion[];
}

export default async function processTextWithAI(
  text: string
): Promise<QuizResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to generate quizzes based on the provided information. Format the response as a JSON object with a title and a list of questions, each with a question and an answer.",
        },
        {
          role: "user",
          content: `Generate a quiz based on the following information: ${text}`,
        },
      ],
    });

    if (completion.choices && completion.choices.length > 0) {
      const messageContent = completion.choices[0].message?.content;
      if (messageContent) {
        const quiz: QuizResponse = JSON.parse(messageContent);
        return quiz;
      } else {
        throw new Error("No valid response content from AI");
      }
    } else {
      throw new Error("No response from AI");
    }
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    throw new Error("Failed to generate quiz using AI");
  }
}
