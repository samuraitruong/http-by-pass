import { http } from "@google-cloud/functions-framework";
import { firefox } from "playwright-core";
import NodeCache from "node-cache";

// Initialize cache with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300 });

async function visitWebsite(url) {
  const browser = await firefox.launch({
    headless: true,
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);

    // Wait for any JSON content to load
    const content = await page.content();

    // Try to parse JSON from the page content
    try {
      // Remove any HTML tags and get only text content
      const textContent = await page.evaluate(() => document.body.innerText);
      // Try to parse the text as JSON
      const jsonData = JSON.parse(textContent);
      return jsonData;
    } catch (parseError) {
      // If JSON parsing fails, return the raw content
      return { raw: content };
    }

    await context.close();
    return content;
  } finally {
    await browser.close();
  }
}

http("callWebsite", async (req, res) => {
  const url = req.query.url || "https://example.com";
  const cacheKey = `website_${url}`;

  try {
    // Check cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      res.json({
        status: "success",
        data: cachedResult,
        fromCache: true,
      });
      return;
    }

    // If not in cache, make the request
    const result = await visitWebsite(url);

    // Store in cache
    cache.set(cacheKey, result);

    res.json({
      status: "success",
      data: result,
      fromCache: false,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
