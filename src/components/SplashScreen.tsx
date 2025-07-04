'use client';

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <img
        src="/splash.png"
        alt="Splash"
        className="w-[300px] h-auto animate-fadeIn"
      />
    </div>
  );
};

export default SplashScreen;
