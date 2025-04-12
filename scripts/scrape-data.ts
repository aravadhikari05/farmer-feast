import path from 'path';
import puppeteer from "puppeteer";
import fs from 'fs/promises';


async function scrapeVendors() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://santacruzfarmersmarket.org/vendors/", {
    waitUntil: "networkidle0",
  });

  const vendorLinks = await page.$$eval("div.vendor-item", (vendors) => {
    const results: { name: string; link: string }[] = [];

    vendors.forEach((vendor) => {
      const h2 = vendor.querySelector("h2.title");
      const onclick = h2?.getAttribute("onclick") || "";
      const idMatch = onclick.match(/jQuery\('#(.*?)'\)/);
      if (!idMatch) return;

      const id = idMatch[1];
      const collapsible = document.getElementById(id);
      if (!collapsible) return;

      const name = h2?.textContent?.trim();
      const linkEl = collapsible.querySelector(".vendor_list_more_link a");
      const href = linkEl?.getAttribute("href");

      if (name && href) {
        results.push({ name, link: href });
      }
    });

    return results;
  });

  const result: Record<string, any> = {};

  for (const { name, link } of vendorLinks) {
    const absoluteLink = new URL(link, page.url()).toString();

    await page.goto(absoluteLink, { waitUntil: "domcontentloaded" });

    const { description, markets, products } = await page.evaluate(() => {
      const descResult: Record<string, string> = {};
      const rows = document.querySelectorAll("tr");
      rows.forEach((tr) => {
        const tds = tr.querySelectorAll("td");
        if (tds.length >= 2) {
          const key = tds[0].textContent
            ?.trim()
            .replace(":", "")
            .toLowerCase()
            .replace(/\s+/g, "_");
          const value = tds[1].textContent?.trim().replace(/\s+/g, " ");
          if (key) descResult[key] = value || "";
        }
      });

      const sidebarSections = Array.from(
        document.querySelectorAll(".vendor_products_sidebar")
      );
      const markets: string[] = [];
      const products: string[] = [];

      sidebarSections.forEach((section) => {
        const heading = section.querySelector("h3")?.textContent?.trim();
        const links = Array.from(section.querySelectorAll("a")).map(
          (a) => a.textContent?.trim() || ""
        );
        if (heading === "Markets") {
          markets.push(...links);
        } else if (heading === "Products") {
          products.push(...links);
        }
      });

      return { description: descResult, markets, products };
    });

    result[name] = {
      link: absoluteLink,
      description,
      markets,
      products,
    };
  }

  await browser.close();
  
  // Save result to file
  const outputPath = path.join(__dirname, `vendor-data.json`);
  
  try {
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
    console.log(`Data successfully saved to ${outputPath}`);

  } catch (error) {
    console.error('Error saving data to file:', error);
  }
}

scrapeVendors();