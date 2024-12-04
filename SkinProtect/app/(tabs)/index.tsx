import { ActivityIndicator, Text, View,  StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UVHome from '@/components/UVHome';
import { getUVIndex } from '@/services/OpenWeatherService';
//location imports
import * as Location from 'expo-location';
import LocationHome from '@/components/LocationHome';

import Header from '@/components/BuddyHeader'
import SkinQuiz from '@/components/SkinQuizComponent';

export default function Index() {
  // Use the safe area insets
  const { top: safeTop } = useSafeAreaInsets();
      // States for UV index and location
  const [uvIndex, setUvIndex] = useState<number | null>(null);
    
  const handleLocationUpdate = async (latitude: number, longitude: number) => {
    try {
      // Fetch UV index using the new location
      const uvData = await getUVIndex(latitude, longitude);
      setUvIndex(uvData);
      console.log(`Updated UV Index: ${uvData}`);
    } catch (error) {
      console.error("Error fetching UV index:", error);
    }

  };
    
    return (
        <View style={[styles.container, {paddingTop:safeTop}]}>
            {/* Header component */}
            <Header/>
             {/* Location Component */}
            <LocationHome onLocationUpdate={handleLocationUpdate} />
            {/* UV Index component */}
            <UVHome uvIndex={uvIndex}/>
            {/* Home Screen Text */}
            <Text style={styles.text}>Home screen</Text>  
            {/* Skin Quiz Component */}
            <SkinQuiz/>
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