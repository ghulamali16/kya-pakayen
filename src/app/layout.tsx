import { Inter, Fredoka } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fredoka = Fredoka({ weight: "600", subsets: ["latin"], variable: "--font-fredoka" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <body className="font-sans bg-amber-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}

