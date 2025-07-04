// File: src/components/ChatBox.tsx
"use client";

import { useState } from "react";

type Message = {
  from: "user" | "bot";
  text: string;
  isOption?: boolean;
  index?: number;
};

export default function ChatBox() {
  const [city, setCity] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preference, setPreference] = useState("veg");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [lastOptions, setLastOptions] = useState<string[]>([]);

  const sendPrompt = async () => {
    if (!city || !ingredients) return;

    const promptData = {
      city,
      ingredients: ingredients.split(","),
      preference,
    };

    const userInput = `City: ${city}, Ingredients: ${ingredients}, Preference: ${preference}`;
    setMessages((prev) => [...prev, { from: "user", text: userInput }]);
    setIsTyping(true);
    setLastPrompt(JSON.stringify(promptData));

    const res = await fetch("/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promptData),
    });

    const data = await res.json();
    const raw = data.text.trim();
    const parts = raw.split(/\n?\d+\.\s/).filter(Boolean);
    const first = parts[0];
    const rest = parts.slice(1);

    setLastOptions(rest);

    setMessages((prev) => [
      ...prev,
      { from: "bot", text: first, isOption: true },
      ...rest.map((text: string, index: number) => ({ from: "bot", text: text.trim(), isOption: true, index: index + 1 })),
    ]);

    setIsTyping(false);
  };

  const handleRecipeRequest = async (index: number) => {
    setIsTyping(true);

    // Updated: use hyphen or fallback to generic name
    const dishName = lastOptions[index - 1]?.split("-")[0]?.trim() || `dish ${index}`;

    const followUpPrompt = `Give me a full Pakistani recipe with ingredients and steps for: ${dishName}.
    Avoid using markdown or special formatting symbols like ** or ##.`;

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: followUpPrompt }),
    });

    const data = await res.json();

    // Show the whole response as one bubble if formatting is lost
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: data.text.trim() },
    ]);

    setIsTyping(false);
  };


  const handleMoreOptions = async () => {
    setIsTyping(true);
    const parsedData = JSON.parse(lastPrompt);
    const followUpPrompt = `Give me 3 more Pakistani dinner options for city: ${parsedData.city}, ingredients: ${parsedData.ingredients}, preference: ${parsedData.preference} Focus on seasonal, regional, and weather-appropriate dishes. 
        Give 1-line descriptions.
        Avoid using markdown or special formatting symbols like ** or ##.

        List each recipe using this format:

        1. Dish Name - One line description
        2. Dish Name - One line description
        3. Dish Name - One line description

        Avoid markdown symbols like ** or ##.`;

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: followUpPrompt }),
    });

    const data = await res.json();
    const parts = data.text.split(/\n?\d+\.\s/).filter(Boolean);
    setLastOptions(parts);

    setMessages((prev) => [
      ...prev,
      ...parts.map((text: string, index: number) => ({ from: "bot", text: text.trim(), isOption: true, index: index + 1 })),
    ]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white rounded-xl shadow">
      <h1 className="text-center text-3xl font-fun text-emerald-700 mb-6">🍲 کیا پکائیں؟ </h1>

      <div className="space-y-3">
        <input
          className="w-full border rounded-xl p-3"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="w-full border rounded-xl p-3"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <select
          className="w-full border rounded-xl p-3"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        >
          <option value="veg">Vegetarian</option>
          <option value="meat">Meat</option>
          <option value="dessert">Dessert</option>
          <option value="quick">Quick</option>
        </select>

        <button
          onClick={sendPrompt}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold"
        >
          What should I cook?
        </button>
      </div>

      <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`relative max-w-xs px-4 py-3 rounded-xl text-sm whitespace-pre-wrap ${
              msg.from === "user" ? "bg-emerald-100 text-right rounded-br-none" : "bg-gray-100 text-left rounded-bl-none"
            }`}>
              {msg.text}
              {msg.isOption && (
                <button
                    onClick={() => handleRecipeRequest(msg.index!)}
                    className="absolute top-1 right-1 text-emerald-600 hover:text-emerald-800"
                >
                    <span className="relative group">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        >
                        <path d="M7 2a1 1 0 00-1 1v1H5a1 1 0 000 2h1v3a3 3 0 003 3h6a3 3 0 003-3V6h1a1 1 0 000-2h-1V3a1 1 0 00-1-1H7zm2 6V6h6v2H9zm2 7a1 1 0 00-1 1v3H9a1 1 0 000 2h6a1 1 0 000-2h-1v-3a1 1 0 00-1-1h-2z" />
                        </svg>
                    <span className="absolute -top-8 right-1 scale-0 group-hover:scale-100 transition-all bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        Get recipe
                    </span>
                    </span>
                </button>
                )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-3 rounded-xl rounded-bl-none flex items-center gap-1">
              <span className="animate-bounce delay-0">•</span>
              <span className="animate-bounce delay-150">•</span>
              <span className="animate-bounce delay-300">•</span>
            </div>
          </div>
        )}
      </div>

      {lastPrompt && (
        <div className="mt-4 text-center">
          <button
            onClick={handleMoreOptions}
            className="text-emerald-600 font-semibold underline"
          >
            Show more recipes
          </button>
        </div>
      )}
    </div>
  );
}
