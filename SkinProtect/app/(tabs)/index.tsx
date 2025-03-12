import { View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, StatusBar, TextInput, Pressable, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getDailyUvi} from '@/services/OpenWeatherService';
//import for storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; 
import { calculateSPF } from '@/services/CalculateRecommendedSPF';
import Header, { BuddyHeaderRef } from '@/components/BuddyHeader';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { router } from 'expo-router';


export default function Index() {
  const [recommendedSPF, setRecommendedSPF] = useState<string | number>('...');
  const [isLoading, setIsLoading] = useState(true);
  const { top: safeTop } = useSafeAreaInsets();
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [isSPFChangedManually, setIsSPFChangedManually] = useState(false);
  
  //spf dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  //spf type
  type spfType = {
    name: string;
    value: number;
  };

  //mock user activity
  const [activity, setActivity] = useState("outdoor_direct");

  //reapplication states
  const [reapplicationTime, setReapplicationTime] = useState<number | null>(null); // Countdown in seconds
  const [message, setMessage] = useState('N/A');

  //ref for buddy header
  const buddyHeaderRef = useRef<BuddyHeaderRef>(null);

  //const with info messages
  const infoMessages = {
    spf: "SPF (Sun Protection Factor) indicates how well sunscreen protects against UVB rays. Higher SPF provides stronger protection.",
    uvIndex: "UV Index measures the level of ultraviolet radiation from the sun. Higher values mean stronger UV exposure and greater risk of skin damage.",
    reapplication: "Reapplying sunscreen is crucial for maintaining effective protection against UV radiation. The frequency of reapplication depends on your activity and the UV index. If you are outdoors in direct sunlight for extended periods, sunscreen should be reapplied regularly to maintain its effectiveness. In contrast, if you spend most of your time indoors, a single morning application may be sufficient. Always reapply every 2 hours if sweating, swimming, or exposed to strong UV rays.",
  };

  //show buddy messages
  const showBuddyMessage = (key: keyof typeof infoMessages) => {
    if (buddyHeaderRef.current) {
      buddyHeaderRef.current.updateMessage(infoMessages[key], true);
    }
  };

  // //Function to clear AsyncStorage
  const clearAsyncStorage = async () => {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared');
  };

  // Clear AsyncStorage on component mount
  useEffect(() => {
    //clearAsyncStorage();
  }, []);

  //image source to be changed as needed
  const [imageSource, setImageSource] = useState(require('../../assets/images/sun.png'));

  //const to keep track of day/night time
  let dayTime = true;
  
  //method to determine if it is day or night
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 24){ 
      //daytime
      setImageSource(require('../../assets/images/sun.png'));
    } else {
      //nighttime
      dayTime = false;
      setImageSource(require('../../assets/images/moon.png'));
    }
  }, []);


  // Re-run every time this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setIsLoading(true);
        try {
          //Get UV + Skin Type from AsyncStorage
          const skinTypeStr = await AsyncStorage.getItem('skinType'); 
          const storedLat = await AsyncStorage.getItem('latitude');
          const storedLon = await AsyncStorage.getItem('longitude');
          const storedUvIndex = await AsyncStorage.getItem('uvIndex')
          if (storedUvIndex) setUvIndex(parseFloat(storedUvIndex));

          // If missing, default to 'N/A'
          if (!skinTypeStr || !storedLat || !storedLon) {
            if (isActive) {
              setRecommendedSPF('N/A');
            }
          } else {
            //check if it is day time
            if (dayTime == true) {
              //const uvNumber = parseFloat(uvIndex);
              const lat = parseFloat(storedLat);
              const lon = parseFloat(storedLon);
              const uvDailyData = await getDailyUvi(lat, lon);

              // Calculate the SPF
              const spf = await calculateSPF(uvDailyData, skinTypeStr);
              if (isActive) {
                setRecommendedSPF(spf);
                // Save the calculated SPF to AsyncStorage
                try {
                  await AsyncStorage.setItem('calculatedSPF', JSON.stringify(spf));
                } catch (error) {
                  console.error('Error saving SPF to AsyncStorage:', error);
                }
              }
            } else {
              setRecommendedSPF('Not Needed');
            }
            
          }
        } catch (error) {
          console.error('Error in HomeScreen fetching SPF:', error);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };
      fetchData();

      // Cleanup: if user leaves screen before fetch finishes
      return () => {
        isActive = false;
      };
    }, [])
  );

  // data for changing spf value
  const spfOptions: spfType[] = [
    { name: 'SPF 2', value: 2 },
    { name: 'SPF 4', value: 4 },
    { name: 'SPF 8', value: 8 },
    { name: 'SPF 10', value: 10 },
    { name: 'SPF 15', value: 15 },
    { name: 'SPF 20', value: 20 },
    { name: 'SPF 25', value: 25 },
    { name: 'SPF 30', value: 30 },
    { name: 'SPF 35', value: 35 },
    { name: 'SPF 40', value: 40 },
    { name: 'SPF 45', value: 45 },
    { name: 'SPF 50+', value: 50 },
    { name: 'SPF 100+', value: 100 },
  ];

  //handle manual spf selection
  const handleChangingSPF = async(selectedItem: spfType) => {
    setRecommendedSPF(selectedItem.value); // Update the spf value
    setIsDropdownOpen(false); // Close the dropdown modal
    setIsSPFChangedManually(true); //take a note that spf was changed
  };

  //function to reset spf after manually changing it
  const resetSPF = async () => {
    let isActive = true; //tracking if the component is still active
    setIsLoading(true); //set loading state while fetching
      try {
        //get the calculated spf from asyncstorage
        const calculatedSPF = await AsyncStorage.getItem('calculatedSPF');
        if (calculatedSPF !== null){
          // parse it back to number and reset recommendedSPF
          setRecommendedSPF(JSON.parse(calculatedSPF));
        } else {
          // If no calculated SPF is found, reset to a default 
          setRecommendedSPF('N/A');
        }
        setIsSPFChangedManually(false); //reset the manual change state
      }
      catch (error) {
        console.error('Error resetting SPF:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);//end loading state
        }
      }
  };

  // decide reapplication logic
  useEffect(() => {
    if (activity === "outdoor_direct" && uvIndex && uvIndex > 6) {
      setReapplicationTime(7200);
      setMessage('');
    } else {
      setReapplicationTime(null);
      setMessage("N/A");
    }
  
  }, [activity, uvIndex]); // <-- Move this outside of handleLocationUpdate
  

  //countdown timer logic
  useEffect(() => {
    if (reapplicationTime === null) return;

    const interval = setInterval(() => {
      setReapplicationTime((prev) => {
        if (prev && prev > 0) {
          return prev -1;
        }else{
          clearInterval(interval);
          return null;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reapplicationTime]);

  // Convert seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      {/* Header component */}
      <Header ref={buddyHeaderRef}/>
      <View style={styles.main}>
        {/* weather image */}
        <View style={styles.weatherPictureContainer}>
          <Image style={styles.weatherPicture} source={imageSource}/>
        </View>

        {/* SPF recommendation */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="yellow" />
            <Text style={styles.loadingText}>Calculating SPF...</Text>
          </View>
        ) : recommendedSPF === 'N/A' ? (
          <Pressable 
            style={styles.button} 
            onPress={() => router.push('/summary')}
          > 
            <Text style={styles.btnlabel}>Get SPF</Text>
          </Pressable>
        ) : (
          <View>
            <Text style={styles.heading1}>SPF {recommendedSPF}</Text>

            {isSPFChangedManually ? (
              <Pressable 
                style={styles.btnChange} 
                onPress={resetSPF}
              >
                <Text style={styles.btnChangelabel}>Get Recommended SPF</Text>
              </Pressable>
            ) : (
              <TouchableOpacity 
                style={styles.btnChange} 
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              > 
                <Text style={styles.btnChangelabel}>Change SPF</Text>
              </TouchableOpacity>
            )}
          </View>
          
        )}

        {/* Dropdown modal for personal spf */}
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
                  data={spfOptions}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleChangingSPF(item)}
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
        
        {/* Current UV index */}
        <Text style={styles.heading2}>
        {isLoading ? (
            "Fetching UV data..."
          ) : uvIndex !== null ? (
            `Current UV Index: ${uvIndex}`
          ) : (
            <>
              Current UV Index: Not Available
              <TouchableOpacity onPress={() => router.push('/summary')}>
                <Text style={styles.UVlabel}> Refresh UV Data</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={() => showBuddyMessage("uvIndex")}>
            <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
          </TouchableOpacity>
        </Text>

        {/* Reapplication */}
        <View style={styles.ReapplicationContainer}>
          <Text style={styles.label}>
            Reapplication: 
            <TouchableOpacity onPress={() => showBuddyMessage("reapplication")}>
              <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
            </TouchableOpacity>
          </Text>
          
          {isLoading ? (
            <ActivityIndicator size="small" color="yellow" />
          ) : reapplicationTime !== null ? (
            <Text style={styles.countdown}>Next in: {formatTime(reapplicationTime)}</Text>
          ) : (
            <Text style={styles.value}>No reapplication needed yet</Text>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: Colors.prussianBlue,
    //rjustifyContent: 'center',
    //alignItems: 'center',
  },
  main: {
    marginTop: 80,
    alignContent: 'center',
    justifyContent: 'center',
  },
  heading1: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  heading2: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 25,
  },
  weatherPictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  weatherPicture: {
    width: 250,
    height: 250,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  btnChange: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 16,
  },
  btnChangelabel:{
    color: Colors.paletteLighterYellow,
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  button:{
    borderRadius: 10,
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: Colors.paletteLighterYellow,
    marginVertical: 15,
 },
 btnlabel: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
 },
 UVlabel:{
    color: Colors.paletteLighterYellow,
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
 },
  ReapplicationContainer: {
    backgroundColor: Colors.seenThroughBG,
    paddingHorizontal:10,
    paddingVertical: 20,
    margin: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 8,
  },
  countdown: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#ffef00'
  },
  label: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffef00', 
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
    backgroundColor: Colors.prussianBlue,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});
