import { load } from "cheerio";
import { MAX_TOKENS } from "../config";

function countTokens(text: string): number {
  return text.split(/\s+/).length;
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const htmlContent = await response.text();
    const $ = load(htmlContent);

    const contentSelectors = [
      "article",
      "main",
      "section",
      "div.content",
      "div.post",
      "div.entry",
      "div.text",
      "div.main",
      "body",
    ];

    let aggregatedTextContent = "";
    let totalTokenCount = 0;

    for (const selector of contentSelectors) {
      if ($(selector).length) {
        const content = cleanText($(selector).text());
        const contentTokens = countTokens(content);

        if (totalTokenCount + contentTokens > MAX_TOKENS) {
          const remainingTokens = MAX_TOKENS - totalTokenCount;
          const words = content.split(/\s+/);
          const limitedContent = words.slice(0, remainingTokens).join(" ");
          aggregatedTextContent += limitedContent + " ";
          break; // Stop adding more content once the limit is reached
        } else {
          aggregatedTextContent += content + " ";
          totalTokenCount += contentTokens;
        }
      }
    }

    if (!aggregatedTextContent.trim()) {
      throw new Error("Failed to extract meaningful content");
    }

    return cleanText(aggregatedTextContent);
  } catch (error) {
    console.error("Error scraping webpage:", error);
    const errorMessage = (error as Error).message;
    throw new Error(`Failed to scrape webpage: ${errorMessage}`);
  }
}
