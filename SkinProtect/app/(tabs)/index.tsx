import { ActivityIndicator, Text, View,  StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SunExposure from "@/components/SunExposure";
import SunExposureScreen from '../SunExposureScreen';
import UVHome from '@/components/UVHome';
import { getCurrentUvi} from '@/services/OpenWeatherService';
//location imports
import LocationHome from '@/components/LocationHome';
import Header from '@/components/BuddyHeader'
import SkinQuiz from '@/components/SkinQuizComponent';
//import for storage
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  // Use the safe area insets
  const { top: safeTop } = useSafeAreaInsets();
      // States for UV index and location
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);

  // load location + uv from storage
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const storedLat = await AsyncStorage.getItem('latitude');
        const storedLon = await AsyncStorage.getItem('longitude');
        const storedUV = await AsyncStorage.getItem('uvIndex');

        // Convert back to numbers if they exist
        if (storedLat) setLatitude(parseFloat(storedLat))
        if (storedLon) setLongitude(parseFloat(storedLon))
        if (storedUV) setUvIndex(parseFloat(storedUV))
      } catch (error) {
        console.warn('Error loading location/UV from AsyncStorage:', error)
      }
    }
    loadPersistedData()
  }, [])
    
// Whenever lat/lon changes, fetch UV and persist
const handleLocationUpdate = async (lat: number, lon: number) => {
  try {
    setLatitude(lat)
    setLongitude(lon)
    await AsyncStorage.setItem('latitude', String(lat))
    await AsyncStorage.setItem('longitude', String(lon))

    const uvData = await getCurrentUvi(lat, lon)
    setUvIndex(uvData)

    // Optionally also store uvIndex so we can show it even before re-fetch
    if (uvData !== null) {
      await AsyncStorage.setItem('uvIndex', String(uvData))
    }
  } catch (error) {
    console.error('Error setting location/UV data:', error)
  }
}
    
    return (
        <View style={[styles.container, {paddingTop:safeTop}]}>
            {/* Header component */}
            <Header/> 
             {/* Location Component */}
            <LocationHome 
            onLocationUpdate={handleLocationUpdate} />
            {/* UV Index component */}
            <UVHome uvIndex={uvIndex}/> 
            {/* Skin Quiz Component */}
            <SkinQuiz/>
             {/*Sun Exposure Component*/}
            <SunExposure /> 
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
//   button: {
//     fontSize: 20,
//     textDecorationLine: 'underline',
//     color: '#fff',
//   },
});