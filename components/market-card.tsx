import { useEffect, useState } from "react";
import { MapPin, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FarmersPopup from "./ui/farmersPopup";
import { getFarmerDetails } from "@/utils/supabase/client";

export type Farmer = {
  name: string;
  location: string;
  hours: string;
};

type Props = Farmer & {
  userLocation?: string | null;
  marketIngredients?: string[];
  allIngredients?: string[];
  farmers?: string[]; // Add this to receive list of farmer names for this market
};

async function getTravelTime(farmerLocation: string, userLocation?: string | null) {
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
  userLocation, 
  marketIngredients = [], 
  allIngredients = [],
  farmers = [] 
}: Props) {
  const [travelTime, setTravelTime] = useState<string>("");
  const [isFarmersDialogOpen, setIsFarmersDialogOpen] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTravelTime(location, userLocation).then(setTravelTime);
  }, [location, userLocation]);

  const handleOpenFarmersDialog = async () => {
    setIsLoading(true);
    try {
      const details = await getFarmerDetails(farmers);
      setFarmerDetails(details);
    } catch (error) {
      console.error("Failed to fetch farmer details:", error);
    } finally {
      setIsLoading(false);
      setIsFarmersDialogOpen(true);
    }
  };

  return (
    <div className="border border-muted rounded-xl bg-card p-4 shadow-sm">
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
      
      <div className="text-sm text-muted-foreground mt-1 ml-6">
        {location} • {hours}
        {travelTime && <> • 🚗 {travelTime} drive</>}
      </div>

      {/* Subpanel for ingredients */}
      {allIngredients.length > 0 && (
        <div className="mt-4 border-t border-muted pt-3">
          <p className="text-sm font-medium text-primary mb-2">
            Ingredients Available ({marketIngredients.length}/{allIngredients.length})
          </p>
          <div className="max-h-40 overflow-y-auto pr-1 custom-scrollbar space-y-1">
            {allIngredients.map((ingredient, i) => (
              <div
                key={i}
                className="flex justify-between text-sm text-muted-foreground border-b border-muted/40 pb-1"
              >
                <span>{ingredient}</span>
                {marketIngredients.includes(ingredient) ? (
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