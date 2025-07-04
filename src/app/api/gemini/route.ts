// File: src/app/api/gemini/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("Missing Gemini API Key", { status: 500 });
  }

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
    console.log("Gemini Flash API raw response:", JSON.stringify(result, null, 2));

    let text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || text.trim() === "") {
      // Fallback prompt
      const fallbackPrompt = `Suggest some Pakistani dinner recipes based on typical weather and regional preferences.
        Include at least 2 options with brief descriptions.
        Focus on seasonal, regional, and weather-appropriate dishes. Give 1-line descriptions.
        Avoid using markdown or special formatting symbols like ** or ##.

        List each recipe using this format:

        1. Dish Name - One line description
        2. Dish Name - One line description
        3. Dish Name - One line description

        Avoid markdown symbols like ** or ##.`;

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
      console.log("Fallback response:", JSON.stringify(fallbackResult, null, 2));

      text = fallbackResult?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry! No recipes found at the moment. Try different ingredients or preferences.";
    }

    return Response.json({ text });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Gemini Flash API error:", err);
    return new Response("Gemini Flash API error: " + err.message, { status: 500 });
  }
}
