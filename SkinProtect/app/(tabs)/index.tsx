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

export default function Index() {
    // Use the safe area insets
    const { top: safeTop } = useSafeAreaInsets();
    const [uvIndex, setUvIndex] = useState<number | null>(null); //state to hold uv
    const [location, setLocation] = useState<Location.LocationObject | null>(null); 
    
    useEffect(()=>{

      //mock location for Ireland (Dublin)
      const mockLocation={
        latitude: 53.3498,
        longitude: -6.2603,
      };
      
      //get Location Permissions
      const getPermissions = async ()=>{
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
          console.log("Please grant location permission");
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        console.log("Location: ");
        console.log(currentLocation);
      };
      getPermissions();

      //fetch Uv index from service
      const fetchUvIndex = async ()=> {
        const uvData=await getUVIndex(mockLocation.latitude, mockLocation.longitude);
          setUvIndex(uvData); 
      };

      fetchUvIndex();
    }, []);
    

    return (
        <View style={[styles.container, {paddingTop:safeTop}]}>
            {/* Header component */}
            <Header/>
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
