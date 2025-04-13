import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, origin } = body;

    if (!destination) {
      console.error("Missing destination");
      return new Response(
        JSON.stringify({ error: "Missing destination" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const originEncoded = encodeURIComponent(origin || "Santa Cruz, CA");
    const destinationEncoded = encodeURIComponent(destination);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originEncoded}&destinations=${destinationEncoded}&key=${process.env.GOOGLE_MAPS_API_KEY}&mode=driving`;

    console.log("Requesting:", url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("Google Maps API response:", data);

    if (data.status !== "OK") {
      return new Response(JSON.stringify({ error: "Distance API failed", details: data }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const travelTime = data.rows[0]?.elements[0]?.duration?.text || "Unknown";

    return new Response(JSON.stringify({ travelTime }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
