"use client";

import { useEffect, useState } from "react";
import { Clock, CalendarDays, MapPin, ArrowUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmersPopup from "./ui/farmersPopup";
import { getFarmerDetails } from "@/utils/supabase/client";


type Props = {
  name: string;
  location?: string;
  hours?: string;
  seasonInfo?: string;
  userLocation?: string | null;
  availability: Record<string, boolean>;
  allIngredients: string[];
  farmers: string[];
};

async function getTravelTime(
  farmerLocation: string,
  userLocation?: string | null
) {
  const res = await fetch("/api/get-distance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      origin: userLocation || "Santa Cruz, CA",
      destination: farmerLocation,
    }),
  });

  const data = await res.json();
  return data.travelTime;
}

export default function MarketCard({
  name,
  location,
  hours,
  seasonInfo,
  userLocation,
  availability,
  allIngredients,
  farmers,
}: Props) {
  const [travelTime, setTravelTime] = useState<string>("");
  const [sortMode, setSortMode] = useState<
    "default" | "az" | "za" | "available"
  >("default");
  const [isFarmersDialogOpen, setIsFarmersDialogOpen] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location) {
      getTravelTime(location, userLocation).then(setTravelTime);
    }
  }, [location, userLocation]);

  // Make sure allIngredients is an array before using it
  const safeIngredients = Array.isArray(allIngredients) ? allIngredients : [];
  
  const marketIngredients = safeIngredients.filter(
    (ingredient) => availability[ingredient.toLowerCase()]
  );

  const sortedIngredients = [...safeIngredients].sort((a, b) => {
    const aAvail = availability[a.toLowerCase()];
    const bAvail = availability[b.toLowerCase()];

    if (sortMode === "az") return a.localeCompare(b);
    if (sortMode === "za") return b.localeCompare(a);
    if (sortMode === "available") {
      return aAvail === bAvail ? 0 : aAvail ? -1 : 1;
    }

    // Default: available first, then alphabetical
    if (aAvail && !bAvail) return -1;
    if (!aAvail && bAvail) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="rounded-2xl border border-muted bg-card p-6 shadow-md hover:shadow-lg transition">
      {/* Market Title */}
      <div className="text-xl font-semibold text-primary mb-1">{name}</div>
  const handleOpenFarmersDialog = async () => {
    setIsLoading(true);
    try {
      // Pass the farmers array to getFarmerDetails
      const details = await getFarmerDetails(farmers);
      setFarmerDetails(details);
      
      // Open the dialog after data is loaded
      setIsFarmersDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch farmer details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-muted rounded-xl bg-card p-4 shadow-sm">
      {/* Market Header */}
      <div className="flex items-center justify-between text-primary font-semibold text-base">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {name}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-3 text-xs"
            onClick={handleOpenFarmersDialog}
          >
            {isLoading ? "Loading..." : "Farmers"}
          </Button>
        </div>
      </div>

      {/* Market Metadata */}
      <div className="text-sm text-muted-foreground space-y-1 mb-4">
        {location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
        {hours && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{hours}</span>
          </div>
        )}
        {seasonInfo && (
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{seasonInfo}</span>
          </div>
        )}
        {travelTime && (
          <div className="flex items-center gap-2">
            <span>🚗 {travelTime} drive</span>
          </div>
        )}
      </div>

      {/* Ingredient Availability */}
      {safeIngredients.length > 0 && (
        <div className="border-t border-muted pt-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-primary">
              Ingredients Available ({marketIngredients.length}/
              {safeIngredients.length})
            </p>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 text-sm">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {[
                  { value: "default", label: "Available → A-Z" },
                  { value: "az", label: "A → Z" },
                  { value: "za", label: "Z → A" },
                  { value: "available", label: "Only Available" },
                ].map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortMode(option.value as any)}
                    className="flex justify-between items-center"
                  >
                    {option.label}
                    {sortMode === option.value && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {sortedIngredients.map((ingredient, idx) => {
              const isAvailable = availability[ingredient.toLowerCase()];
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between text-sm rounded-md px-3 py-1.5 border ${
                    isAvailable
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <span>{ingredient}</span>
                  <span className="font-semibold">
                    {isAvailable ? "✔" : "✘"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Farmers Popup */}
      <FarmersPopup
        isOpen={isFarmersDialogOpen}
        onClose={() => setIsFarmersDialogOpen(false)}
        farmers={farmerDetails}
        marketName={name}
      />
    </div>
  );
}