'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import FarmerCard from "../ui/farmerCard";
import { useState } from "react";

type IngredientWithFarmers = {
    name: string;
    farmers: {
      name: string;
      image: string;
      email: string;
      address: string;
      website: string;
      products: string[];
    }[];
  };

  const sampleData = [
    {
      name: "tomatoes",
      farmers: [
        {
          name: "Farmer John",
          image: "/download.jpeg",
          email: "john@farm.com",
          address: "123 Farm Lane",
          website: "https://farmerjohn.com",
          products: ["tomatoes", "lettuce", "carrots"],
        },
        {
          name: "Farmer Linda",
          image: "/download.jpeg",
          email: "linda@freshroots.com",
          address: "456 Garden Ave",
          website: "https://lindagrows.com",
          products: ["tomatoes", "cucumbers"],
        },
      ],
    },
    {
      name: "potatoes",
      farmers: [
        {
          name: "Farmer Mike",
          image: "/download.jpeg",
          email: "mike@spuds.com",
          address: "789 Root Street",
          website: "https://mikespuds.com",
          products: ["potatoes", "onions"],
        },
      ],
    },
    {
      name: "onions",
      farmers: [],
    },
  ];
  

export default function ProductList() {
    
      const [ingredients, setIngredients] = useState(sampleData);
    return (
        <div>
          <Accordion type="single" collapsible>
            {ingredients.map((ingredient, index) => (
              <AccordionItem key={ingredient.name} value={`item-${index}`}>
                <AccordionTrigger>{ingredient.name}</AccordionTrigger>
                <AccordionContent>
                  {ingredient.farmers.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {ingredient.farmers.map((farmer) => (
                        <FarmerCard key={farmer.email} {...farmer} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No farmers available for this ingredient.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    }
