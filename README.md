# 🍲 Kya-Pakayen — Pakistani Recipe Suggestion Chatbot

**Kya-Pakayen** is a chat-style web app that suggests regional Pakistani recipes based on:

- 🌡️ Weather in your city
- 🥦 Seasonal ingredients
- 🍗 Dietary preference (veg, meat, dessert, quick)
- 🇵🇰 Regional/provincial dish styles

It uses **Google Gemini AI** for generating natural recipe ideas, **Open-Meteo API** for live weather, and is built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**.

---

## 🚀 Features

- 🧠 AI-powered suggestions with Gemini API
- 📍 Weather-aware recommendations
- 🥘 Supports all Pakistani regions
- 🥬 Optional seasonal ingredients input
- 💬 Real chat-style UI with bubbles + typing indicator
- 🇵🇰 Urdu + English (voice coming soon)
- ✋ Rate-limited to prevent abuse
- 🎨 Graffiti splash screen with food art

---

## 🔧 Tech Stack

| Tech             | Purpose                    |
|------------------|----------------------------|
| Next.js 14       | Full-stack React framework |
| Tailwind CSS     | UI styling                 |
| TypeScript       | Safer coding               |
| Google Gemini API| Recipe generation          |
| Open-Meteo API   | Real-time weather data     |
| Vercel           | Deployment & hosting       |
| Ngrok            | Local sharing              |

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/ghulamali16/kya-pakayen.git
cd kya-pakayen
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Set Environment Variables

Create a `.env.local` file in the root and add:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

Get your API key from: https://aistudio.google.com/app/apikey

---

## 🧪 Running Locally

```bash
npm run dev
```

Then open: http://localhost:3000

To share with others using ngrok:

```bash
ngrok http 3000
```

---

## 🛡️ Abuse Protection

Basic in-memory **rate limiter** to prevent excessive Gemini API calls.  
You can improve this with middleware like Redis or IP-aware rate limits in production.

---

## 🖼️ UI/UX Highlights

- Graffiti-style splash screen
- Messenger-style chat interface
- Typing bubble animation (•••)
- Interactive "Get Recipe" buttons
- Funny header font and colors

---

## ✍️ Credits

Made with ❤️, code, salt & pepper by **[Ghulam Ali Butt](https://github.com/ghulamali16)**

Shoutout to:
- Google Gemini Team
- Open-Meteo API
- All Pakistani moms for asking: *"Kya Pakayen aaj?"*
