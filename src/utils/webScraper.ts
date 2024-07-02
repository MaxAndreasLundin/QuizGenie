import axios from "axios";
import cheerio from "cheerio";

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract text content from relevant HTML tags
    const textContent = $("body").text();

    // Optionally, you can filter out non-meaningful text based on your needs
    const cleanedText = textContent.replace(/\s+/g, " ").trim();

    return cleanedText;
  } catch (error) {
    console.error("Error scraping webpage:", error);
    throw new Error("Failed to scrape webpage");
  }
}
