'use client';
import { useEffect, useState } from 'react';
import ChatBox from "@/components/ChatBox";
import SplashScreen from '@/components/SplashScreen';


export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000); // 3s splash
    return () => clearTimeout(timer);
  }, []);


      if (showSplash) return    <div className="min-h-screen bg-white"><SplashScreen /> </div>;
      return <div><ChatBox /></div>
  
}
