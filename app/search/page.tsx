"use client";

import { useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const dishes = [
  "Pasta Primavera",
  "Chicken Parmesan",
  "Vegan Tacos",
  "Ratatouille",
  "Tofu Stir Fry",
];

export default function SearchPage() {
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [marketData, setMarketData] = useState<
    { name: string; location: string; hours: string }[]
  >([]);

  // Typing animation
  useEffect(() => {
    const fullText = `Try '${dishes[index]}'`;
    if (hasInteracted) {
      setPlaceholder(fullText);
      return;
    }

    const speed = isDeleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setPlaceholder((prev) => prev.slice(0, -1));
      } else {
        setPlaceholder((prev) => fullText.slice(0, prev.length + 1));
      }

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      }

      if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % dishes.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, index, hasInteracted]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/get-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealName: inputValue }),
      });

      const data = await res.json();
      setIngredients(
        data.ingredients?.split(",").map((ingredient: string) =>
          ingredient
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase())
        ) || []
      );

      setMarketData(data.markets || []);
    } catch (err) {
      console.error("API error:", err);
      setIngredients(["Something went wrong."]);
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full flex flex-col justify-start items-center px-4 pt-24"
      style={{ minHeight: "calc(100vh - 233px)" }}
    >
      {/* Title & Subtitle */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-center"
      >
        Find Recipes
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-muted-foreground mt-4 text-center max-w-md"
      >
        Enter a dish name to discover what goes into it - and where to shop for
        the freshest ingredients.
      </motion.p>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex w-full max-w-xl items-center justify-center mt-8"
      >
        <div className="flex w-full max-w-xl rounded-xl overflow-hidden shadow-md border border-muted bg-card">
          <div className="flex items-center justify-center px-3 bg-white dark:bg-white text-primary">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setHasInteracted(true);
            }}
            className="flex-1 py-2.5 px-3 text-base bg-white dark:bg-white text-primary placeholder:text-primary/60 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition rounded-none"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </motion.form>

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 w-full max-w-2xl bg-card border border-muted rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4">
            Ingredients
          </h2>
          <ul className="space-y-2">
            {ingredients.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Market Info */}
      {marketData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 w-full max-w-2xl bg-card border border-muted rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-4">
            Where to Buy
          </h2>
          <ul className="space-y-4">
            {marketData.map((market, i) => (
              <li key={i} className="border border-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-base font-medium">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {market.name}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {market.location}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 italic">
                  Hours: {market.hours}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
