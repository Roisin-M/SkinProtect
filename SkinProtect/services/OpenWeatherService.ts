const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_API_KEY

export const getCurrentUvi = async (latitude: number, longitude: number) => {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.log('in response not okay - failed to fetch uv index');
      throw new Error("Failed to fetch UV Index");
    }
    const data = await response.json();
    console.log('There is a uv response');
    //extract the UV index from the current object
    const uvIndex = data.current.uvi;
    console.log(`data of uv index is returned from service getUVIndex : ${data}`);
    //alert(`${uvIndex}`);
    return uvIndex; // Returns the UV index data when called
  } catch (error) {
    console.error("Error fetching UV Index:", error);
    return null;
  }
};

export const getDailyUvi = async (latitude:number, longitude:number) =>{
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;

  try{
    const response = await fetch(url);
    if(!response.ok){
      console.log('response not okay, failed to fetch uv index');
      throw new Error("Failed to fetch response from API")
    }
    const data = await response.json();
    console.log('There is an response')
    //fetch daily uvi from array of 8 day forecast
    const uvIndex = data.daily[0].uvi;
    console.log(`data of uv index is returned from service getUVIndex: ${uvIndex}`);
    return uvIndex;
  }catch(error){
    console.error("Error fetching Daily Max UV Index:", error);
    return null;
  }
}
