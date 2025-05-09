import { createClient } from "@supabase/supabase-js";
import marketInfo from "@/scripts/market-info.json"; // adjust path as needed

const marketMetaMap = Object.fromEntries(
  marketInfo.markets.map((m) => [
    m.name.toLowerCase(), // normalize for consistent matching
    {
      location: m.location,
      time: m.time,
      months: m.months,
    },
  ])
);
// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getFarmerDetails(farmerNames: string[]) {
  // Don't query if no farmers are provided
  if (!farmerNames || farmerNames.length === 0) {
    return {};
  }

  // Create query with filter for any of the farmer names
  const { data, error } = await supabase
    .from('farmers')
    .select('name, email, address, website, image_url, about') // Added description field
    .in('name', farmerNames);

  if (error) {
    throw new Error(error.message);
  }

  // Transform array of farmer objects into a map with name as key
  const farmerMap = (data || []).reduce((map: Record<string, any>, farmer) => {
    if (farmer.name) {
      map[farmer.name] = farmer;
    }
    return map;
  }, {});

  return farmerMap;
}

export async function getProductsByName(name: string) {
  // Query the view filtered by product name
  const { data, error } = await supabase
    .from("product_farmers_markets")
    .select("farmer, market")
    .ilike("product", name);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return { product: name, markets: [] };
  }

  // Group results by market
  const groupedByMarket = Object.values(
    data.reduce((acc: any, row) => {
      if (!acc[row.market]) {
        acc[row.market] = { market: row.market, farmers: [] };
      }
      if (!acc[row.market].farmers.includes(row.farmer)) {
        acc[row.market].farmers.push(row.farmer);
      }
      return acc;
    }, {})
  );

  return {
    product: name,
    markets: groupedByMarket,
  };
}export async function getIngredientAvailability(ingredients: string[]) {
  // Updated: adding wildcards for partial matching.
  const startsWithFilters = ingredients
    .map((ingredient) => `product.ilike.%${ingredient}%`)
    .join(",");
    
  const { data, error } = await supabase
    .from("product_farmers_markets")
    .select("product, market, farmer")
    .or(startsWithFilters);
  
  if (error) throw new Error(error.message);
  
  const normalizeMarket = (market: string) => {
    if (market.includes("Westside")) return "Westside";
    if (market.includes("Downtown")) return "Downtown";
    if (market.includes("Live Oak")) return "Live Oak";
    return market;
  };
  
  type MarketData = {
    market: string;
    availability: Record<string, boolean>;
    farmers: Set<string>;
  };
  
  const marketMap: Record<string, MarketData> = {};
  
  for (const { market, product, farmer } of data) {
    // Check if the product contains any of the desired ingredients
    const matchingIngredient = ingredients.find((ing) => {
      return product.toLowerCase().includes(ing.toLowerCase());
    });
    
    if (!matchingIngredient) continue;
    
    const normalizedMarket = normalizeMarket(market);
    
    if (!marketMap[normalizedMarket]) {
      marketMap[normalizedMarket] = {
        market: normalizedMarket,
        availability: {},
        farmers: new Set(),
      };
    }
    
    marketMap[normalizedMarket].availability[matchingIngredient] = true;
    marketMap[normalizedMarket].farmers.add(farmer);
  }
  
  // Ensure all ingredients are represented in the result, even if false.
  for (const market of Object.values(marketMap)) {
    for (const ingredient of ingredients) {
      if (!(ingredient in market.availability)) {
        market.availability[ingredient] = false;
      }
    }
  }
  
  return Object.values(marketMap).map((entry) => ({
    market: {
      name: entry.market,
      ...marketMetaMap[entry.market.toLowerCase()],
    },
    availability: entry.availability,
    farmers: Array.from(entry.farmers),
  }));
}
