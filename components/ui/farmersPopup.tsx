import React from "react";
import FarmerCard from "./farmerCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FarmerDetails = {
  name: string;
  image_url: string;
  email: string;
  address: string;
  website: string;
  description?: string; // Added description field
  products?: string[];
};

type FarmersPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  farmers: Record<string, FarmerDetails>;
  marketName: string;
};

export default function FarmersPopup({
  isOpen,
  onClose,
  farmers,
  marketName,
}: FarmersPopupProps) {
  const farmersList = Object.values(farmers);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Farmers at {marketName}
          </DialogTitle>
        </DialogHeader>
        
        {farmersList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {farmersList.map((farmer) => (
              <FarmerCard
                key={farmer.name}
                name={farmer.name}
                image={farmer.image_url || "/placeholder-farm.jpg"}
                email={farmer.email || "Not available"}
                address={farmer.address || "Not available"}
                website={farmer.website || "https://example.com"}
                products={farmer.products || ["Information not available"]}
                bio={farmer.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No farmer information available for this market.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}