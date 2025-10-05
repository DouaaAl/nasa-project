// app/api/nasaBuoys/route.js

export async function GET() {
  try {
    const res = await fetch(
      "https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt"
    );
    const text = await res.text();

    // Simple parser for demo purposes
    const lines = text.split("\n").slice(2); // skip headers
    const buoys = lines
      .map((line) => {
        const parts = line.split(/\s+/);
        if (parts.length < 7) return null;
        return {
          id: parts[0],
          lat: parseFloat(parts[1]),
          lon: parseFloat(parts[2]),
          temperature: parseFloat(parts[3]),
          wave_height: parseFloat(parts[6]),
          timestamp: Date.now(),
        };
      })
      .filter(Boolean);

    return new Response(JSON.stringify(buoys), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
