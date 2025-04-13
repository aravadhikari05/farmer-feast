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
    image: string;
    email: string;
    address: string;
    website: string;
    bio?: string;
    products: string[];
  };
  
  export default function FarmerCard({
    name,
    image,
    email,
    address,
    website,
    bio,
    products,
  }: FarmerCardProps) {
    return (
      <div>
      <HoverCard >
        <HoverCardTrigger asChild>
          <div>
        <Card className="w-[250px] flex flex-col overflow-hidden shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-bold cursor-pointer">
            {name}
          </CardTitle>
        </CardHeader>
  
        <CardContent className="flex flex-col items-center px-4 pb-0 space-y-4">
          <img
            src={image}
            alt={name}
            className="w-full h-40 object-cover rounded-md border"
          />
  
          <div className="text-sm text-gray-700 space-y-2 w-full">
            <div>
              <span className="font-semibold">Email:</span> {email}
            </div>
            <div>
              <span className="font-semibold">Address:</span> {address}
            </div>
            <div>
              <span className="font-semibold">Website:</span>{" "}
              <a
                href={website}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
        </CardContent>
  
        <CardFooter className="text-sm text-gray-700 px-4 pt-2 pb-4">
          <div className="w-full">
            <span className="font-semibold">Products:</span> {products.join(", ")}
          </div>
        </CardFooter>
      </Card>
      </div>
        </HoverCardTrigger>
        <HoverCardContent side = "right" className="bg-primary-foreground w-64 shadow-xl rounded-lg">
          <div className = "font-semibold mb-2">
            About
          </div>
          <p className="text-sm font-light">
            {bio}
            </p>
        </HoverCardContent>
      </HoverCard>


      
      </div>
    );
  }
  