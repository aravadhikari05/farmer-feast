"use client";

import { useEffect, useState } from "react";
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
  const [isFarmersDialogOpen, setIsFarmersDialogOpen] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location) {
      getTravelTime(location, userLocation).then(setTravelTime);
    }
  }, [location, userLocation]);

  const marketIngredients = allIngredients.filter(
    (ingredient) => availability[ingredient.toLocaleLowerCase()]
  );

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
      <div className="text-sm text-muted-foreground mt-1 ml-6">
        {location && <span>{location}</span>}
        {hours && <span> • {hours}</span>}
        {travelTime && <span> • 🚗 {travelTime} drive</span>}
        {seasonInfo && <span> • 🗓️ {seasonInfo}</span>}
      </div>

      {/* Ingredients Panel */}
      {allIngredients.length > 0 && (
        <div className="mt-4 border-t border-muted pt-3">
          <p className="text-sm font-medium text-primary mb-2">
            Ingredients Available ({marketIngredients.length}/
            {allIngredients.length})
          </p>
          <div className="max-h-40 overflow-y-auto pr-1 custom-scrollbar space-y-1">
            {[...allIngredients]
              .sort((a, b) => {
                const aAvailable = availability[a.toLowerCase()];
                const bAvailable = availability[b.toLowerCase()];
                return aAvailable === bAvailable ? 0 : aAvailable ? -1 : 1;
              })
              .map((ingredient, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm text-muted-foreground border-b border-muted/40 pb-1"
                >
                  <span>{ingredient}</span>
                  {availability[ingredient.toLocaleLowerCase()] ? (
                    <span className="text-green-600">✔</span>
                  ) : (
                    <span className="text-red-400">✘</span>
                  )}
                </div>
              ))}
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
