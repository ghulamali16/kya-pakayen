export async function getWeather(city: string): Promise<string> {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();
  
    const { latitude, longitude } = geoData.results?.[0] || {};
  
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
    );
    const weatherData = await weatherRes.json();
  
    const temp = weatherData?.current?.temperature_2m;
  
    if (temp > 30) return "hot";
    if (temp > 20) return "warm";
    return "cool";
  }
  