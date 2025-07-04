// File: src/app/api/suggest/route.ts
import { getWeather } from "@/lib/weather"; // ✅ using your existing weather lib
import { withRateLimit } from "@/lib/withRateLimit";


export const POST = withRateLimit(async (req: Request) => {
  const { city, ingredients = [], preference } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("Missing Gemini API Key", { status: 500 });
  }

  const weather = await getWeather(city); // ✅ reuse your shared lib

  const prompt = `
    Suggest 2–3 Pakistani dinner recipes for:
    - City: ${city}
    - Today's Weather: ${weather}
    - Ingredients: ${ingredients.join(", ")}
    - Preference: ${preference}
    Focus on seasonal, regional, and weather-appropriate dishes. Give 1-line descriptions.
    Avoid using markdown or special formatting symbols like ** or ##.

    List each recipe using this format:

    1. Dish Name - One line description
    2. Dish Name - One line description
    3. Dish Name - One line description

    Avoid markdown symbols like ** or ##.
  `;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const result = await res.json();
    console.log("Suggest API Gemini response:", JSON.stringify(result, null, 2));

    let text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || text.trim() === "") {
      const fallbackPrompt = `Suggest some Pakistani dinner ideas for ${city}, considering ${weather} weather and regional food culture. Include 2–3 options. Avoid using markdown or special formatting symbols like ** or ##.`;

      const fallbackRes = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: fallbackPrompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const fallbackResult = await fallbackRes.json();
      console.log("Fallback Suggest response:", JSON.stringify(fallbackResult, null, 2));

      text = fallbackResult?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry! No suggestions right now. Try different ingredients or city.";
    }

    return Response.json({ text });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Suggest API error:", err);
    return new Response("Suggest API error: " + err.message, { status: 500 });
  }
})
