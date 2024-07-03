import { load } from "cheerio";

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const data = await response.text();
    const $ = load(data);

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

    let textContent = "";
    for (const selector of contentSelectors) {
      if ($(selector).length) {
        textContent = $(selector).text();
        if (textContent.trim()) break;
      }
    }

    if (!textContent) {
      throw new Error("Failed to extract meaningful content");
    }

    const cleanedText = textContent.replace(/\s+/g, " ").trim();

    return cleanedText;
  } catch (error) {
    console.error("Error scraping webpage:", error);
    throw new Error("Failed to scrape webpage");
  }
}
