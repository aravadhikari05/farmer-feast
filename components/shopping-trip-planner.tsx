"use client";

import { useState } from "react";
import { ChevronDown, ShoppingBag, MapPin, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
  onToggle,
}: ShoppingTripProps) {
  const [maxStops, setMaxStops] = useState(3);

  const notFound = Object.keys(ingredientMap).length < total;
  const missingCount = total - Object.keys(ingredientMap).length;

  if (markets.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-muted bg-card p-6 shadow-md">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            {isOpen
              ? "Shopping Trip Plan"
              : `Shopping Trip Plan (${coverage}/${total} ingredients)`}
          </h3>
        </div>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </Button>
      </div>

      {/* Accordion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="accordion"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden mt-4"
          >
            <div className="text-sm text-muted-foreground mb-4">
              {coverage === total
                ? `Visit ${markets.length > 1 ? "these" : "this"} ${markets.length > 1 ? markets.length : ""} market${markets.length > 1 ? "s" : ""} to get ${total > 1 ? `all ${total}` : "the"} ingredient${total > 1 ? "s" : ""}:`
                : `${markets.length > 1 ? `These ${markets.length} markets have` : "This market has"} ${coverage} out of ${total} ingredients you need:`}
            </div>

            <div className="space-y-4">
              {markets.map((market, i) => (
                <div
                  key={i}
                  className="p-4 border border-muted rounded-lg bg-card/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-primary text-lg">
                        {market.market.name}
                      </div>

                      <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {market.location && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <div className="text-sm">{market.location}</div>
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
                          Ingredients to buy here (
                          {
                            Object.values(market.availability).filter(Boolean)
                              .length
                          }{" "}
                          {`item${Object.values(market.availability).filter(Boolean)
                              .length > 1 ? `s` : ""} to buy here`}):
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(market.availability)
                            .filter(([_, available]) => available)
                            .map(([ingredient]) => {
                              const formattedIngredient = ingredient.replace(
                                /\b\w/g,
                                (c) => c.toUpperCase()
                              );
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
              <div className="mt-4 p-4 border border-secondary bg-secondary/10 rounded-lg">
                <div className="font-medium text-secondary-foreground mb-1">
                  Missing Ingredients ({missingCount})
                </div>
                <div className="text-sm text-secondary-foreground/90">
                  We couldn't find the following ingredients at any of the
                  markets:
                  <div className="flex flex-wrap gap-2 mt-2">
                    {markets[0].allIngredients
                      .filter(
                        (ingredient: string) =>
                          !Object.keys(ingredientMap).includes(
                            ingredient.toLowerCase()
                          )
                      )
                      .map((ingredient: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-full text-xs"
                        >
                          {ingredient}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-medium text-primary mb-3">
                Complete Ingredient Guide
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {markets[0].allIngredients.map(
                  (ingredient: string, i: number) => {
                    const matchingMarkets =
                      ingredientMap[ingredient.toLowerCase()] || [];
                    const isFound = matchingMarkets.length > 0;
                    return (
                      <div
                        key={i}
                        className={`text-sm border rounded-lg p-3 ${
                          isFound
                            ? "bg-success/10 border-success text-success"
                            : "bg-secondary/10 border-secondary text-secondary-foreground"
                        }`}
                      >
                        <div
                          className={`font-medium ${isFound ? "text-success" : "text-secondary-foreground"}`}
                        >
                          {ingredient}
                        </div>
                        <div
                          className={`text-xs mt-1 ${isFound ? "text-success/80" : "text-secondary-foreground/70"}`}
                        >
                          {isFound
                            ? `Available at: ${matchingMarkets.join(", ")}`
                            : "Not available at any market"}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
