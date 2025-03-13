import { View,  StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SunExposure from "@/components/SunExposure";
import UVHome from '@/components/UVHome';
//import getUVIndex from '@/services/OpenWeatherService';
//location imports
import LocationHome from '@/components/LocationHome';
import Header, { BuddyHeaderRef } from '@/components/BuddyHeader';
import SkinQuiz from '@/components/SkinQuizComponent';
//import for storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUvi } from '@/services/OpenWeatherService';
import { Ionicons } from '@expo/vector-icons';
import ProfileHeader from '@/components/ProfileHeader';
import { Colors } from '@/constants/colors';

export default function SummaryScreen() {
  // Use the safe area insets
  const { top: safeTop } = useSafeAreaInsets();
      // States for UV index and location
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);

  //ref for buddy header
  const buddyHeaderRef = useRef<BuddyHeaderRef>(null);

  //const with info messages
  const infoMessages = {
    info: "In this section you should provide all the important details to get the best SPF recommendation and reapplication suggestion! Just a few quick steps, and you’ll know exactly how to stay protected while enjoying the sun! 🌞✨",
  };

  //show buddy messages
  const showBuddyMessage = (key: keyof typeof infoMessages) => {
    if (buddyHeaderRef.current) {
      buddyHeaderRef.current.updateMessage(infoMessages[key], true);
    }
  };

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
            {/* Header components row */}
      <View style={styles.headerRowContainer}>
        <Header ref={buddyHeaderRef}/>
        <ProfileHeader/>
      </View>
            <View style={styles.main}>
              <ScrollView >
                <Text style={styles.heading}>
                  Skin & Sun
                  <TouchableOpacity onPress={() => showBuddyMessage("info")}>
                    <Ionicons name="help-circle" color={Colors.highLightYeelow} size={24} style={styles.icon} />
                  </TouchableOpacity>
                </Text>
                {/* Location Component */}
                <LocationHome onLocationUpdate={handleLocationUpdate} />
                {/* UV Index component */}
                <UVHome uvIndex={uvIndex}/> 
                {/* Skin Quiz Component */}
                <SkinQuiz/>
                {/*Sun Exposure Component*/}
                <SunExposure /> 
              </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.prussianBlue,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  main: {
    marginTop: 80,
    alignContent: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  text: {
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 20,
  },
  heading: {
    color: Colors.textLight,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
  },icon: {
    marginLeft: 8,
  },
  headerRowContainer:{
    position: 'absolute',
    top: 20, 
    left: 0, 
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
});