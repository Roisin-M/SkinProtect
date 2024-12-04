import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/colors'
import * as Location from 'expo-location'

type Props = {
    onLocationUpdate: (latitude: number, longitude: number) => void; // Callback to update latitude and longitude
}
const LocationHome = ({onLocationUpdate, }: Props) => {
    const [currentRegion, setCurrentRegion] = useState<string | null>(null); // State to store region name
    const handleAutoLocation = async () => {
        try {
          // Request location permissions
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            alert("Permission to access location was denied.");
            return;
          }
          alert("permission granted");

          // Get current location
          let currentLocation = await Location.getCurrentPositionAsync({});

          const lat = currentLocation.coords.latitude;
          const lon = currentLocation.coords.longitude;

          const reversegeoCodedAddress = await Location.reverseGeocodeAsync({
            longitude: lon,
            latitude: lat
          });
          console.log(`reverse geocodes to address`);
          console.log(reversegeoCodedAddress);
          console.log(`Latitude: ${lat}, Longitude: ${lon}`);

          // Extract the region (e.g., "County Sligo")
        if (reversegeoCodedAddress.length > 0) {
            const region = reversegeoCodedAddress[0].region || 'Unknown Region';
            setCurrentRegion(region);
        } else {
            setCurrentRegion('Unknown Region');
        }
          
          // Pass latitude and longitude to the parent component
          onLocationUpdate(lat, lon);
        } catch (error) {
          console.error("Error fetching location:", error);
          alert("An error occurred while fetching location.");
        }
      };
    
      const handleManualLocation = () => {
        alert("Manual location selection is not implemented yet.");
      };

  return (
    <View style={styles.container}>
    {/* Display City Name */}
    <Text style={styles.cityName}>
    {currentRegion ? `Your Region: ${currentRegion}` : 'Fetching Region...'}
        </Text>

    {/* Buttons Side by Side */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.btn} onPress={handleAutoLocation}>
        <Text style={styles.btnText}>Auto-Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleManualLocation}>
        <Text style={styles.btnText}>Manual Location</Text>
      </TouchableOpacity>
    </View>
  </View>
  )
}

export default LocationHome

const styles = StyleSheet.create({
    container:{
        margin: 16,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.softText,
        marginBottom: 8,
      },
      cityName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.softText,
        marginBottom: 10, // Add space below city name
        textAlign: 'center',
      },
      buttonContainer: {
        flexDirection: "row", // Position buttons side by side
        justifyContent: "space-between", // Space between buttons
        width: "100%", // Full width of the container
      },
      btn: {
        backgroundColor: Colors.blue,
        paddingVertical: 12,
        paddingHorizontal: 5,
        marginHorizontal:5,
        borderRadius: 10,
        alignItems: 'center',
        flex:1,
      },
      btnText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
      },
      
})