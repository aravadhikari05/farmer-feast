import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export type Farmer = {
  name: string;
  location: string;
  hours: string;
};

type Props = Farmer & {
  userLocation?: string | null;
  marketIngredients?: string[];
  allIngredients?: string[];
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

export default function FarmerCard({ name, location, hours, userLocation, marketIngredients = [], allIngredients = [] }: Props) {
  const [travelTime, setTravelTime] = useState<string>("");

  useEffect(() => {
    getTravelTime(location, userLocation).then(setTravelTime);
  }, [location, userLocation]);

  return (
    <div className="border border-muted rounded-xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-primary font-semibold text-base">
        <MapPin className="w-4 h-4" />
        {name}
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
    </div>
  );
}