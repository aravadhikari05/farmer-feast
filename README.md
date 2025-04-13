# Farmer Feast: Sustainable Eating Starts Here

![alt text](https://github.com/aravadhikari05/farmer-feast/blob/fd25e848f4076d69a6ec3317764398fa89d82709/project-images/img-1.png "Homepage")

Farmer Feast is a web application that helps users find fresh, locally sourced ingredients for any dish they want to make — directly from nearby farmers and markets in the Santa Cruz area.

Our mission is to promote **sustainable food practices**, support **local farmers**, and encourage **healthy eating habits**. By connecting dishes to real-world market data, we make it easier than ever to shop local and eat fresh.

---

## Built for Sustainability

We're submitting Farmer Feast under the **Sustainability** category because we believe that:
- **Supporting local agriculture** reduces food miles and emissions.
- **Seasonal and local sourcing** fights industrial food waste.
- **Health-conscious, eco-aware communities** start with access and awareness.

---

## How It Works

1. **User enters any dish** (e.g., “Vegan Tacos”).
2. **Our engine generates a list of ingredients** using prompt-engineered calls to **Gemini**.
3. We **cross-reference the ingredients** with scraped market and farmer data stored in a database.
4. We calculate the distance to nearby farmers markets selling the required items.
5. We display a curated list of farmers markets and farmers, highlighting available ingredients and proximity.

---

## Tech Stack

| Tech           | Role                                                                 |
|----------------|----------------------------------------------------------------------|
| **Next.js**    | Full-stack framework for server functions and routing                |
| **React**      | Frontend user interface                                  |
| **Tailwind CSS** | Clean, responsive design system                                     |
| **Supabase**   | Realtime backend and postgreSQL database for scraped product data    |
| **Google Maps API** | Distance-based sorting of markets              |
| **Gemini API** | Ingredient generation via prompt-engineered LLM                     |
| **Puppeteer**  | Headless browser used for scraping local market and farmer data      |
| **Vercel**     | Deployment, serverless functions, and hosting                        |

---

## Why Farmers Feast?

Eating local is better for:
- **The planet**: Reduced transportation and emissions
- **Your health**: Fresher, nutrient-rich ingredients
- **The community**: Direct support for local farmers and small businesses

Farm2Fork makes sustainability **convenient, modern, and personal**.

---

This project is built for the CruzHacks hackathon.
