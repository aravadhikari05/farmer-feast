import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getFarmerDetails(farmer: string) {
  const {data, error} = await supabase
    .from('farmers')
    .select('name, email, address, website, image_url')
    .ilike('name', farmer)

  if (error) {
    throw new Error(error.message);
  }

  return data;
}