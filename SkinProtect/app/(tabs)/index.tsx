import { ActivityIndicator, Text, View,  StyleSheet } from 'react-native';
//new imports
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
//uv imports
import Header from '@/components/Header'
import UVHome from '@/components/UVHome';
import { getUVIndex } from '@/services/OpenWeatherService';
//location imports
import * as Location from 'expo-location';
import LocationHome from '@/components/LocationHome';

export default function Index() {
    // Use the safe area insets
    const { top: safeTop } = useSafeAreaInsets();
    const [uvIndex, setUvIndex] = useState<number | null>(null); //state to hold uv
    const [location, setLocation] = useState<Location.LocationObject | null>(null); 
    const [latitude, setLatitude] = useState<number | null>(null); // State to hold latitude
    const [longitude, setLongitude] = useState<number | null>(null); // State to hold longitude
    
    useEffect(()=>{

      //mock location for Ireland (Dublin)
      // const mockLocation={
      //   latitude: 53.3498,
      //   longitude: -6.2603,
      // };
      
      //get Location Permissions and fetch UV Index
      const getPermissionsAndUVIndex = async () => {
        try {
            // Request location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log("Please grant location permission");
                return;
            }

            // Get the current location
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            // Extract latitude and longitude
            const lat = currentLocation.coords.latitude;
            const lon = currentLocation.coords.longitude;
            setLatitude(lat);
            setLongitude(lon);

            console.log(`Latitude: ${lat}, Longitude: ${lon}`);

            // Fetch UV index using latitude and longitude
            const uvData = await getUVIndex(lat, lon);
            setUvIndex(uvData);
        } catch (error) {
            console.error("Error fetching location or UV index:", error);
        }
    };
      getPermissionsAndUVIndex();
    }, []);
    

    return (
        <View style={[styles.container, {paddingTop:safeTop}]}>
            {/* Header component */}
            <Header/>
            {/* Location component */}
            <LocationHome/>
            {/* UV Index component */}
            <UVHome uvIndex={uvIndex}/>
            {/* Home Screen Text */}
            <Text style={styles.text}>Home screen</Text>
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