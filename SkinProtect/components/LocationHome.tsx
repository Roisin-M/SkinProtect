import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/colors'
import * as Location from 'expo-location'

type LocationType = {
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
    onLocationUpdate: (latitude: number, longitude: number) => void; // Callback to update latitude and longitude
}
const LocationHome = ({onLocationUpdate }: Props) => {
    const [currentRegion, setCurrentRegion] = useState<string | null>(null); // State to store region name
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
// Mock data for manual location selection
const mockLocations: LocationType[] = [
  { name: 'Dublin', latitude: 53.3498, longitude: -6.2603 },
  { name: 'California', latitude: 36.7783, longitude: -119.4179 },
  {name: 'Melbourne', latitude:-37.814, longitude:144.96332 },
  { name:'Rio de Janeriro', latitude:-22.908333, longitude:-43.196388 },
];
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
          
          // Pass latitude and longitude to parent 
          onLocationUpdate(lat, lon);
        } catch (error) {
          console.error("Error fetching location:", error);
          alert("An error occurred while fetching location.");
        }
      };
    
      const handleManualLocation = (selectedItem: LocationType) => {
        console.log(`Manually selected location: ${selectedItem.name}, Latitude: ${selectedItem.latitude}, Longitude: ${selectedItem.longitude}`);
        setCurrentRegion(selectedItem.name); // Update the displayed region name
        onLocationUpdate(selectedItem.latitude, selectedItem.longitude); // Pass coordinates to parent
        setIsDropdownOpen(false); // close the dropdown
      };
    
  return (
    <View style={styles.container}>
    {/* Display Region Name */}
    <Text style={styles.cityName}>
    {currentRegion ? `Your Region: ${currentRegion}` : 'Fetching Region...'}
        </Text>

    {/* Auto Location Button */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.btn} onPress={handleAutoLocation}>
        <Text style={styles.btnText}>Auto-Location</Text>
      </TouchableOpacity>

      {/* Custom Dropdown */}
      <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.dropdownButtonText}>
            Manually Select
          </Text>
        </TouchableOpacity>
      </View>
 {/* Dropdown Modal */}
 {isDropdownOpen && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDropdownOpen}
          onRequestClose={() => setIsDropdownOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownContainer}>
              <FlatList
                data={mockLocations}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleManualLocation(item)}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsDropdownOpen(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
        shadowOffset: { width: 0, height: 1 },
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
      dropdownButton: {
        backgroundColor: Colors.blue,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
      },
      dropdownButtonText: {
        color: Colors.white,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '700',
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',//opacity
      },
      dropdownContainer: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      dropdownItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
      },
      dropdownItemText: {
        fontSize: 16,
        color: Colors.black,
      },
      closeButton: {
        marginTop: 10,
        backgroundColor: Colors.blue,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
      },
      closeButtonText: {
        color: Colors.white,
        fontSize: 16,
      },
})