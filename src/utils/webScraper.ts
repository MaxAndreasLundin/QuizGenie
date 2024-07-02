import axios from "axios";
import { load } from "cheerio";

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url);
    const $ = load(data);

    // Extract text content from relevant HTML tags
    const contentSelectors = [
      "article", // Many blogs and news sites
      "main", // Main content area
      "section", // Sections of content
      "div.content", // Generic content container
      "div.post", // Blog posts
      "div.entry", // Entries in blogs or forums
      "div.text", // Generic text container
      "div.main", // Main content area
      "body", // Fallback
    ];

    let textContent = "";
    for (const selector of contentSelectors) {
      if ($(selector).length) {
        textContent = $(selector).text();
        if (textContent.trim()) break; // If we found meaningful text, stop
      }
    }

    if (!textContent) {
      throw new Error("Failed to extract meaningful content");
    }

    // Optionally, you can filter out non-meaningful text based on your needs
    const cleanedText = textContent.replace(/\s+/g, " ").trim();

    return cleanedText;
  } catch (error) {
    console.error("Error scraping webpage:", error);
    throw new Error("Failed to scrape webpage");
  }
}
