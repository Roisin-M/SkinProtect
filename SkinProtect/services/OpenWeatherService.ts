const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_API_KEY

export const getUVIndex = async (latitude: number, longitude: number) => {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.log('in response not okay - failed to fetch uv index');
      throw new Error("Failed to fetch UV Index");
    }
    console.log('There is a uv response');
    const data = await response.json();
    console.log(`data of uv index is returned from service getUVIndex : ${data}`);
    return data.current.uvi; // Returns the UV index data
  } catch (error) {
    console.error("Error fetching UV Index:", error);
    return null;
  }
};
