"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

type FarmerCardProps = {
  name: string;
  image?: string;
  email?: string;
  address?: string;
  website?: string;
  about?: string;
  products?: string[];
};

export default function FarmerCard({
  name,
  image,
  email,
  address,
  website,
  about,
  products = [],
}: FarmerCardProps) {

  if (!email && !about && !website && !address) {
    return null;
  }
  
  // Only render HoverCard if bio is available
  const hasHoverContent = about && about.trim().length > 0;
  
  const card = (
    <Card className="w-[250px] h-[300px] flex flex-col overflow-hidden">
      <CardHeader className="text-center p-2">
        <CardTitle className="text-lg font-bold cursor-pointer truncate text-primary">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center px-4 pb-0 flex-1 overflow-hidden">
        {image ? (
          <div className="w-full h-[100px] mb-2">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-md border border-muted"
            />
          </div>
        ) : (
          <div className="w-full h-[100px] mb-2 bg-muted/30 rounded-md border border-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-1 w-full overflow-y-auto max-h-[80px] pr-1 custom-scrollbar">
          {email && (
            <div className="truncate">
              <span className="font-medium text-foreground">Email:</span> {email}
            </div>
          )}
          {address && (
            <div className="truncate">
              <span className="font-medium text-foreground">Address:</span> {address}
            </div>
          )}
          {website && (
            <div className="truncate">
              <span className="font-medium text-foreground">Website:</span>{" "}
              <a
                href={website}
                className="text-primary hover:text-primary/80 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </CardContent>

      {products.length > 0 && (
        <CardFooter className="text-sm text-muted-foreground px-4 pt-2 pb-2 mt-auto">
          <div className="w-full max-h-[40px] overflow-y-auto custom-scrollbar">
            <span className="font-medium text-foreground">Products:</span>{" "}
            <span className="line-clamp-1">{products.join(", ")}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );

  // If there's no bio content, just return the card without the HoverCard wrapper
  if (!hasHoverContent) {
    return <div className="h-[300px]">{card}</div>;
  }
  
  // Otherwise, wrap it in HoverCard for the bio information
  return (
    <div className="h-[300px]">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div>{card}</div>
        </HoverCardTrigger>
        <HoverCardContent 
          side="left" 
          align="start"
          className="w-64"
        >
          <div className="font-medium text-foreground mb-2">
            About
          </div>
          <p className="text-sm text-muted-foreground">
            {about}
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
