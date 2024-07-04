import { load } from "cheerio";
import type { CheerioAPI } from "cheerio";
import { MAX_TOKENS } from "../config";

function countTokens(text: string): number {
  return text.split(/\s+/).length;
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

async function fetchWebpage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }
  return response.text();
}

function extractContent($: CheerioAPI, selectors: string[]): string {
  let aggregatedContent = "";
  let totalTokens = 0;

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length) {
      elements.each((_, element) => {
        const text = $(element).text();
        const tokens = countTokens(text);
        if (totalTokens + tokens <= MAX_TOKENS) {
          aggregatedContent += " " + text;
          totalTokens += tokens;
        } else {
          const remainingTokens = MAX_TOKENS - totalTokens;
          const limitedText = limitContent(text, remainingTokens);
          aggregatedContent += " " + limitedText;
          totalTokens = MAX_TOKENS;
          return false; // Break the loop
        }
      });
      if (totalTokens >= MAX_TOKENS) break;
    }
  }

  return aggregatedContent.trim();
}

function limitContent(content: string, maxTokens: number): string {
  const words = content.split(/\s+/);
  return words.slice(0, maxTokens).join(" ");
}

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    const htmlContent = await fetchWebpage(url);
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

    let content = extractContent($, contentSelectors);

    if (!content) {
      throw new Error("Failed to extract meaningful content");
    }

    return cleanText(content);
  } catch (error) {
    console.error(`Error scraping webpage at ${url}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to scrape webpage: ${error.message}`);
    }
    throw new Error("Failed to scrape webpage: Unknown error");
  }
}
