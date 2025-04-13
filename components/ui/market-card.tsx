"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useState } from "react";

type MarketCardProps = {
  name: string;
  image_url: string;
  location: string;
  time: string;
  months: string;
  features: string[];
  about: string;
};

export default function MarketCard({
  name,
  image_url,
  location,
  time,
  months,
  features,
  about,
}: MarketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxCharacters = 390; // Adjust this value as needed
  
  const displayText = isExpanded 
    ? about 
    : about.length > maxCharacters 
      ? `${about.substring(0, maxCharacters)}...` 
      : about;
  
  return (
    <Card className="w-full overflow-hidden shadow-md rounded-2xl border border-muted bg-card">
      <CardContent className="flex flex-col gap-6 p-6">
        {/* Top section: Image and Market Info */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Image */}
          <div className="md:w-1/2 flex justify-center items-center rounded-md">
            <img
              src={image_url}
              alt={name}
              className="max-w-full max-h-80 object-contain transition-transform hover:scale-105 duration-500"
            />
          </div>

          {/* Right side - Market details (excluding about) */}
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-xl font-semibold text-primary mb-4">{name}</h2>
            <div className="text-sm text-muted-foreground space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0"></span>
                <div><span className="font-medium text-primary">Location:</span> {location}</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0"></span>
                <div><span className="font-medium text-primary">When:</span> {time}</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0"></span>
                <div><span className="font-medium text-primary">Season:</span> {months}</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 bg-primary rounded-full shrink-0"></span>
                <div>
                  <span className="font-medium text-primary">Features:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {features.map((feature, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section - About with Read More functionality */}
        <div className="pt-4 border-t border-muted">
          <h3 className="text-xl font-semibold text-primary mb-3">About:</h3>
          <div className="text-sm text-muted-foreground">
            <p>{displayText}</p>
            {about.length > maxCharacters && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-primary font-medium hover:underline focus:outline-none"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
