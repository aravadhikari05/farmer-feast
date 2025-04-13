// updated SearchPage.tsx with scrollable subpanel in FarmerCard
"use client";

import { useEffect, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import FarmerCard, { Farmer } from "@/components/market-card";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [markets, setMarkets] = useState<Farmer[]>([]);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const showResults = ingredients.length > 0;
  const showSplit = showResults && markets.length > 0;

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

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude},${longitude}`;
        setUserLocation(coords);
      },
      (err) => {
        console.warn("Geolocation failed or denied:", err);
        setUserLocation(null);
      }
    );
  }, []);

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
          ingredient.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        ) || []
      );

      setMarkets([
        {
          name: "Santa Cruz Farmers Market",
          location: "Cedar St & Lincoln St, Downtown, Santa Cruz, CA",
          hours: "Wed 1–5pm",
        },
        {
          name: "Westside Market",
          location: "Mission St., Santa Cruz, CA",
          hours: "Sat 9–1pm",
        },
      ]);
    } catch (err) {
      console.error("API error:", err);
      setIngredients(["Something went wrong."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full px-6">
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: showResults ? 0 : 50 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl"
        style={{
          minHeight: "calc(100vh - 233px)",
          paddingTop: showResults ? "6rem" : "0",
        }}
      >
        <div
          className={`w-full flex flex-col ${
            showSplit ? "md:flex-row gap-12" : ""
          } ${!showResults ? "items-center justify-center" : ""}`}
        >
          <div
            className={`flex-1 flex flex-col ${
              showResults ? "md:items-start" : "items-center"
            }`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`text-4xl font-bold ${
                showResults ? "md:text-left" : "text-center"
              }`}
            >
              Find Ingredients
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`text-muted-foreground mt-4 max-w-md ${
                showResults ? "md:text-left" : "text-center"
              }`}
            >
              Enter a dish name to discover what goes into it - and where to
              shop for the freshest ingredients.
            </motion.p>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex w-full max-w-xl items-center justify-center mt-8"
            >
              <div className="flex w-full rounded-xl overflow-hidden shadow-md border border-muted bg-card">
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

            {ingredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-12 w-full max-w-2xl bg-card border border-muted rounded-2xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-primary mb-2">
                  Ingredients
                </h2>
                <p className="text-sm font-light text-muted-foreground mb-4">
                  Select what you already have:
                </p>
                <div className="flex flex-col gap-2 mb-2">
                  {ingredients.map((item, i) => {
                    const isLast = i === ingredients.length - 1;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`ingredient-${i}`} />
                          <label
                            htmlFor={`ingredient-${i}`}
                            className="text-sm text-muted-foreground"
                          >
                            {item}
                          </label>
                        </div>
                        {isLast && (
                          <button
                            type="submit"
                            className="ml-4 -mt-3 px-3 py-2 bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition rounded-full"
                            disabled={loading}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {showSplit && (
            <motion.div
              layout
              className="w-full md:sticky md:top-24 h-fit rounded-2xl shadow-sm backdrop-blur-md bg-card/80 border border-muted p-6"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-6 text-primary">
                Nearby Markets
              </h2>
              <div className="space-y-6">
                {markets.map((market, i) => (
                  <FarmerCard
                    key={i}
                    name={market.name}
                    location={market.location}
                    hours={market.hours}
                    userLocation={userLocation}
                    marketIngredients={["Tomatoes", "Basil", "Olive Oil"]}
                    allIngredients={ingredients}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}