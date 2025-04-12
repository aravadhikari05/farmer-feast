import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    markets: groupedByMarket
  };
}