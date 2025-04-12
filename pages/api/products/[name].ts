import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({path: '.env.local'});

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid product name' });
  }

  // Query the view filtered by product name
  const { data, error } = await supabase
    .from("product_farmers_markets")
    .select("farmer, market")
    .ilike("product", name);

  if (error) {
    console.error('Query error:', error);
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ 
      error: `No results found for product: ${name}` 
    });
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

  res.status(200).json({
    product: name,
    markets: groupedByMarket
  });
}
