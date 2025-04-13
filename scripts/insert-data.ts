import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// change to regular .env for production probably
// dotenv.config({path: '.env.local'});
dotenv.config();
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const filePath = path.join(__dirname, 'vendor-data.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const vendors: Record<string, { markets?: string[]; products?: string[]; description?: { email?: string; contact?: string; website?: string } }> = JSON.parse(raw);

  // 1. Collect all unique markets
  const marketSet = new Set<string>();
  Object.values(vendors).forEach((v: any) => {
    v.markets?.forEach((m: string) => marketSet.add(m));
  });
  const markets = Array.from(marketSet).map((name) => ({ name }));

  // 2. Insert markets
  const { data: insertedMarkets, error: marketError } = await supabase
    .from('markets')
    .upsert(markets, { onConflict: 'name' })
    .select();

  if (marketError) {
    console.error('❌ Market insert error:', marketError);
    return;
  }

  // Build a map: market name → ID
  const marketMap = Object.fromEntries(insertedMarkets.map((m) => [m.name, m.id]));

  // 3. Insert farmers (no market_id — we’ll use join table)
  const farmers = Object.entries(vendors).map(([name, vendor]: any) => ({
    name,
    email: vendor.description?.email || null,
    address: vendor.description?.contact || null,
    website: vendor.description?.website || null,
    about: vendor.description?.about || null,
    image_url: vendor.image_url || null,
  }));

  const { data: insertedFarmers, error: farmerError } = await supabase
    .from('farmers')
    .insert(farmers)
    .select();

  if (farmerError) {
    console.error('❌ Farmer insert error:', farmerError);
    return;
  }

  // 4. Link each farmer to their markets (many-to-many)
  const farmerMarketLinks = insertedFarmers.flatMap((farmer, i) => {
    const original = Object.values(vendors)[i];
    return (original.markets || []).map((marketName: string) => ({
      farmer_id: farmer.id,
      market_id: marketMap[marketName],
    }));
  });

  const { error: linkError } = await supabase
    .from('farmer_markets')
    .insert(farmerMarketLinks);

  if (linkError) {
    console.error('❌ Farmer-markets link error:', linkError);
    return;
  }

  // 5. Insert products linked to farmers
  const products = insertedFarmers.flatMap((farmer, i) => {
    const original = Object.values(vendors)[i];
    return ((original as { products?: string[] }).products || []).map((product: string) => ({
      name: product,
      farmer_id: farmer.id,
    }));
  });

  const { error: productError } = await supabase
    .from('products')
    .insert(products);

  if (productError) {
    console.error('❌ Product insert error:', productError);
    return;
  }

  console.log(`✅ Done! Inserted ${insertedMarkets.length} markets, ${insertedFarmers.length} farmers, and ${products.length} products.`);
}

main();