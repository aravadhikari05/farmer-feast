"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingBag, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ShoppingTripProps = {
  isOpen: boolean;
  markets: any[];
  coverage: number;
  total: number;
  ingredientMap: Record<string, string[]>;
  onToggle: () => void;
};

export function ShoppingTripPlanner({
  isOpen,
  markets,
  coverage,
  total,
  ingredientMap,
  onToggle
}: ShoppingTripProps) {
  const [maxStops, setMaxStops] = useState(3);

  const notFound = Object.keys(ingredientMap).length < total;
  const missingCount = total - Object.keys(ingredientMap).length;

  if (markets.length === 0) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 rounded-2xl border border-muted bg-card p-6 shadow-md"
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            {isOpen ? "Shopping Trip Plan" : `Shopping Trip Plan (${coverage}/${total} ingredients)`}
          </h3>
        </div>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <div className="text-sm text-muted-foreground mb-4">
            {coverage === total
              ? `Visit these ${markets.length} market${markets.length > 1 ? "s" : ""} to get all ${total} ingredients:`
              : `These ${markets.length} market${markets.length > 1 ? "s" : ""} have ${coverage} out of ${total} ingredients you need:`}
          </div>

          <div className="space-y-4">
            {markets.map((market, i) => (
              <div key={i} className="p-4 border border-muted rounded-lg bg-card/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-primary text-lg">{market.market.name}</div>

                    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {market.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{market.location}</span>
                        </div>
                      )}
                      {market.hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{market.hours}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="text-sm font-medium mb-2">
                        Ingredients to buy here ({Object.values(market.availability).filter(Boolean).length} items):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(market.availability)
                          .filter(([_, available]) => available)
                          .map(([ingredient]) => {
                            const formattedIngredient = ingredient.replace(/\b\w/g, (c) => c.toUpperCase());
                            return (
                              <span
                                key={ingredient}
                                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                              >
                                {formattedIngredient}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notFound && (
            <div className="mt-4 p-4 border border-destructive bg-destructive/10 rounded-lg">
              <div className="font-medium text-destructive mb-1">
                Missing Ingredients ({missingCount})
              </div>
              <div className="text-sm text-destructive">
                We couldn't find the following ingredients at any of the markets:
                <div className="flex flex-wrap gap-2 mt-2">
                  {markets[0].allIngredients.filter((ingredient: string) =>
                    !Object.keys(ingredientMap).includes(ingredient.toLowerCase())
                  ).map((ingredient: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-destructive/20 text-destructive rounded-full text-xs"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-sm font-medium text-primary mb-3">Complete Ingredient Guide</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {markets[0].allIngredients.map((ingredient: string, i: number) => {
                const matchingMarkets = ingredientMap[ingredient.toLowerCase()] || [];
                const isFound = matchingMarkets.length > 0;
                return (
                  <div
                    key={i}
                    className={`text-sm border rounded-lg p-3 ${
                      isFound ? "bg-accent/10 border-accent text-accent-foreground" : "bg-muted text-muted-foreground border-muted"
                    }`}
                  >
                    <div className={`font-medium ${isFound ? "text-accent-foreground" : "text-destructive"}`}>
                      {ingredient}
                    </div>
                    <div className={`text-xs mt-1 ${isFound ? "text-accent-foreground/80" : "text-destructive/80"}`}>
                      {isFound
                        ? `Available at: ${matchingMarkets.join(", ")}`
                        : "Not available at any market"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
