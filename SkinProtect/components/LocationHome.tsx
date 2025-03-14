import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '@/constants/colors'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CitySearch from './CitySearch'
import { PlaceResult } from '@/services/GooglePlacesService'

// type LocationType = {
//   name: string;
//   latitude: number;
//   longitude: number;
// };

type Props = {
    onLocationUpdate: (latitude: number, longitude: number) => void; // Callback to update latitude and longitude
}
const LocationHome = ({onLocationUpdate}: Props) => {
    const [currentRegion, setCurrentRegion] = useState<string | null>(null); // State to store region name
    const [isSearchModalVisible, setIsSearchModalVisible] = useState<boolean>(false);

    // Load region from AsyncStorage
    useEffect(() => {
      const loadRegion = async () => {
        try {
          const storedRegion = await AsyncStorage.getItem('region')
          if (storedRegion) {
            setCurrentRegion(storedRegion)
          }
        } catch (error) {
          console.error('Error loading region from AsyncStorage:', error)
        }
      }
      loadRegion()
    }, [])

// Mock data for manual location selection
// const mockLocations: LocationType[] = [
//   { name: 'Dublin', latitude: 53.3498, longitude: -6.2603 },
//   { name: 'California', latitude: 36.7783, longitude: -119.4179 },
//   {name: 'Melbourne', latitude:-37.814, longitude:144.96332 },
//   { name:'Rio de Janeriro', latitude:-22.908333, longitude:-43.196388 },
//   { name: 'Mexico City', latitude:19.432608, longitude:-99.133209 },
//   { name: 'Hawaii', latitude: 19.741755, longitude: -155.844437 },
// ];

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

          // Extract the region ("County Sligo")
          let regionName='';
        if (reversegeoCodedAddress.length > 0) {
            regionName = reversegeoCodedAddress[0].region || 'Unknown Region';
            setCurrentRegion(regionName);
        } 
          
          // Save region to AsyncStorage
          await AsyncStorage.setItem('region', regionName)

          // Pass latitude and longitude to parent 
          onLocationUpdate(lat, lon);
        } catch (error) {
          console.error("Error fetching location:", error);
          alert("An error occurred while fetching location.");
        }
      };
    
      // const handleManualLocation = async(selectedItem: LocationType) => {
      //   console.log(`Manually selected location: ${selectedItem.name}, Latitude: ${selectedItem.latitude}, Longitude: ${selectedItem.longitude}`);
      //   setCurrentRegion(selectedItem.name); // Update the displayed region name
      //   // Save region to AsyncStorage
      //   await AsyncStorage.setItem('region', selectedItem.name)
      //   onLocationUpdate(selectedItem.latitude, selectedItem.longitude); // Pass coordinates to parent
      //   setIsDropdownOpen(false); // close the dropdown
      // };

      const handleSelectCity = async (item: PlaceResult) =>{
        //item is displayname, lat, lon
        setCurrentRegion(item.displayName);
        try{
          await AsyncStorage.setItem('region', item.displayName);
        }catch(error){
          console.error('error saving selected city: ', error);
        }
        //pass to parent
        onLocationUpdate(item.latitude, item.longitude);
        setIsSearchModalVisible(false);
      };
    
      return (
        <View style={styles.container}>
          <Text style={styles.cityName}>
            {currentRegion ? `Your Region: ${currentRegion}` : 'Fetching Region...'}
          </Text>
    
          {/* Manual Select Button */}
          <TouchableOpacity 
            style={styles.manualButton} 
            onPress={() => setIsSearchModalVisible(true)}
          >
            <Text style={styles.manualButtonText}>Manual Select</Text>
          </TouchableOpacity>
    
          {/* Auto-Location Button */}
          <TouchableOpacity style={styles.btn} onPress={handleAutoLocation}>
            <Text style={styles.btnText}>Auto-Location</Text>
          </TouchableOpacity>
    
          {/* Modal for CitySearch */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isSearchModalVisible}
            onRequestClose={() => setIsSearchModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <CitySearch onSelectCity={handleSelectCity} />
                <TouchableOpacity 
                  style={styles.closeModalButton} 
                  onPress={() => setIsSearchModalVisible(false)}
                >
                  <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    };
    
    export default LocationHome;
    
    const styles = StyleSheet.create({
      container: {
        margin: 16,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
      cityName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.softText,
        marginBottom: 10,
        textAlign: 'center',
      },
      manualButton: {
        backgroundColor: Colors.prussianBlue,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
      },
      manualButtonText: {
        color: Colors.textLight,
        fontSize: 16,
        fontWeight: '700',
      },
      btn: {
        backgroundColor: Colors.prussianBlue,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
      },
      btnText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        width: '90%',
        backgroundColor: Colors.background,
        borderRadius: 10,
        padding: 16,
        maxHeight: '80%',
      },
      closeModalButton: {
        backgroundColor: Colors.prussianBlue,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
      },
      closeModalButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
      },
    });