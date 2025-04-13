import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getFarmerDetails(farmer: string) {
  const { data, error } = await supabase
    .from("farmers")
    .select("name, email, address, website, image_url")
    .ilike("name", farmer);

  if (error) {
    throw new Error(error.message);
  }

  return data;
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
}
export async function getIngredientAvailability(ingredients: string[]) {
  const startsWithFilters = ingredients
    .map((ingredient) => `product.ilike.${ingredient}%`)
    .join(",");

  const { data, error } = await supabase
    .from("product_farmers_markets")
    .select("product, market, farmer") // include farmer here
    .or(startsWithFilters);

  if (error) throw new Error(error.message);

  // Use Set to ensure uniqueness
  type MarketData = {
    market: string;
    availability: Record<string, boolean>;
    farmers: Set<string>;
  };

  const marketMap: Record<string, MarketData> = {};

  for (const { market, product, farmer } of data) {
    const matchingIngredient = ingredients.find((ing) =>
      product.toLowerCase().startsWith(ing.toLowerCase())
    );

    if (!matchingIngredient) continue;

    if (!marketMap[market]) {
      marketMap[market] = {
        market,
        availability: {},
        farmers: new Set(),
      };
    }

    marketMap[market].availability[matchingIngredient] = true;
    marketMap[market].farmers.add(farmer);
  }

  for (const market of Object.values(marketMap)) {
    for (const ingredient of ingredients) {
      if (!(ingredient in market.availability)) {
        market.availability[ingredient] = false;
      }
    }
  }

  return Object.values(marketMap).map((entry) => ({
    market: entry.market,
    availability: entry.availability,
    farmers: Array.from(entry.farmers),
  }));
}
