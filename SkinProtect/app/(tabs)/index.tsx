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
//authentication
import ProfileHeader from '@/components/ProfileHeader';
//reapplication
import getReapplicationRecommendation from '../utils/getReapplicationRecommendation';
//countdown
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import * as Progress from 'react-native-progress';
import ProgressBar from '@/components/ProgressBar';
import { auth } from '@/firebaseConfig';
import { fetchUserProfile } from '@/services/profileService';
import { string } from 'zod';


export default function Index() {
  //const [skinType, setSkinType] = useState<string|null>(null);
  const [recommendedSPF, setRecommendedSPF] = useState<string | number>('...');
  const [isLoading, setIsLoading] = useState(true);
  const { top: safeTop } = useSafeAreaInsets();
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [isSPFChangedManually, setIsSPFChangedManually] = useState(false);
  const [skinType, setSkinType] = useState<string|null>(null);
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
  const [reapplicationTime, setReapplicationTime] = useState<number | null>(null); // Countdown will be in seconds
  const [message, setMessage] = useState('Not Available');
  const [reapplicationActivity, setReapplicationActivity] = useState('');
  const [reapplicationExposure, setReapplicationExposure] = useState('');

  //ref for buddy header
  const buddyHeaderRef = useRef<BuddyHeaderRef>(null);

  //const with info messages
  const infoMessages = {
    spf: "SPF (Sun Protection Factor) indicates how well sunscreen protects against UVB rays. Higher SPF provides stronger protection.",
    uvIndex: "UV Index measures the level of ultraviolet radiation from the sun. Higher values mean stronger UV exposure and greater risk of skin damage.",
    reapplication: "Reapplying sunscreen is crucial for maintaining effective protection against UV radiation. The frequency of reapplication depends on your activity and the UV index. If you are outdoors in direct sunlight for extended periods, sunscreen should be reapplied regularly to maintain its effectiveness. In contrast, if you spend most of your time indoors, a single morning application may be sufficient. Always reapply every 2 hours if sweating, swimming, or exposed to strong UV rays. But keep in mind this is only a recommendation and you should still consider all factors when deciding if you need to reapply more frequently!",
    spfChange: "If you don’t have the recommended SPF, you can select the one you have, and I’ll adjust the reapplication for you! But keep in mind the UV index—if it’s high, using low SPF factors won’t be effective at all!",
    spfBackToRecommended: "Want to check the recommended SPF instead of the one you selected? This button is here for you!",
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

  //Load the user's skin type
  async function loadSkinType(): Promise<string | null> {
    try {
      const user = auth.currentUser;

      // If user is logged in => check Firestore
      if (user) {
        const profile = await fetchUserProfile();
        if (profile && profile.skinType) {
          console.log('Skin type fetched from Firestore:', profile.skinType);
          return profile.skinType;
        }
      }

      // logged out? retrieve skin type from AsyncStorage
      console.log('Fetching skin type from AsyncStorage...');
      const storedSkinType = await AsyncStorage.getItem('skinType');
      if (storedSkinType) {
        console.log('Skin type from AsyncStorage:', storedSkinType);
        return storedSkinType;
      }
    } catch (error) {
      console.error('Error loading skin type:', error);
    }

    // If none found, return null
    return null;
  }


  const fetchSPFData = async () => {
      //Get UV + Skin Type from AsyncStorage
      const storedLat = await AsyncStorage.getItem('latitude');
      const storedLon = await AsyncStorage.getItem('longitude');
      const storedUvIndex = await AsyncStorage.getItem('uvIndex');
      
      //fetch skin type, activities and exposure data
      const reapActivity = await AsyncStorage.getItem('activity');
      const reapExposure = await AsyncStorage.getItem('exposure');
      //const skinType = await AsyncStorage.getItem('skinType');

      if (storedUvIndex) setUvIndex(parseFloat(storedUvIndex));
      if(reapActivity) setReapplicationActivity(reapActivity);
      if (reapExposure) setReapplicationExposure(reapExposure);
      //if (skinType) setSkinType(skinType);

      // If missing, default to 'N/A'
      if (!skinType || !storedLat || !storedLon) {
          setRecommendedSPF('N/A');
          console.log('in fetchspfdata() : if missing? recommendedspf is set to N/A');
          console.log('skintype: '+ skinType);
      } 
      else{
        //check if it is day time
       if (dayTime == true) {
          //const uvNumber = parseFloat(uvIndex);
            const lat = parseFloat(storedLat);
            const lon = parseFloat(storedLon);
            const uvDailyData = await getDailyUvi(lat, lon);
            // Calculate the SPF
            const spf = await calculateSPF(uvDailyData, skinType);
            console.log('skintype: '+ skinType);
            setRecommendedSPF(spf);
  
            // Save the calculated SPF to AsyncStorage
            try {
              await AsyncStorage.setItem('calculatedSPF', JSON.stringify(spf));
            } catch (error) {
              console.error('Error saving SPF to AsyncStorage:', error);
            }
          }
          else{
            setRecommendedSPF('Not Needed');
          }
      }
    };

    //wait on skin type update before fetching spf
    useEffect(() => {
      if (!skinType) {
        // no skin type => recommended = N/A
        setRecommendedSPF('N/A');
        return;
      }
      // otherwise fetch the lat/lon, uv, etc
      (async () => {
        console.log("Now that we have skinType:", skinType);
        await fetchSPFData(); // uses the latest `skinType`
      })();
    }, [skinType]);
    

  // Re-run every time this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchEverything = async ()=>{
        setIsLoading(true);
        try{
          //load user or guest skin type
          const foundSkinType = await loadSkinType();
          if(isActive){
            //await fetchSPFData();
            setSkinType(foundSkinType);
            console.log('new skin type '+ skinType);
            //console.log(recommendedSPF);
          }
        } catch(error){
          console.error('Error in HomeScreen fetching SPF:', error);
        } finally{
          if(isActive){
            setIsLoading(false);
          }
        }
      };
      fetchEverything();
      // if user leaves screen before fetch finishes
      return () => {
        isActive = false;
      };
    }, [dayTime])
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
          console.log('in resetSPF() : recommendedspf is set to N/A')
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

  // get reapplication recommendation
  const reapRecommendation = getReapplicationRecommendation(skinType, uvIndex, recommendedSPF, reapplicationActivity, reapplicationExposure);
  //method to set corresponding message and reapplication time based on the result
  useEffect(() => {
    if (reapRecommendation === null) return;

    if (reapRecommendation === 1) {
      setReapplicationTime(0); //no reapplication here needed
      setMessage('No Need for SPF today');
    } 
    else if (reapRecommendation === 2) {
      setReapplicationTime(0); //no reapplication here needed
      setMessage('Apply only in the morning');
    }
    else if (reapRecommendation === 3){
      setReapplicationTime(14400); //4 hours in seconds
      setMessage('Reapply every 4 hours');
    }
    else if (reapRecommendation === 4){
      setReapplicationTime(7200); //2 hours in seconds
      setMessage('Reapply every 2 hours');
    }
  }, [reapRecommendation]);
  
  //countdown timer logic
  useEffect(() => {
    if (reapplicationTime === null) return;
    

    const interval = setInterval(() => {
      setReapplicationTime((prev) => {
        if (prev && prev > 0) {
          return prev -1;
        }else{
          clearInterval(interval);
          alert("Time to reapply SPF!")

          //reset the countdown
          setTimeout(() => {
            if (reapRecommendation === 3) {
              setReapplicationTime(14400); //4hrs
            } else if (reapRecommendation === 4) {
              setReapplicationTime(7200); // 2 hours
            }
          }, 1000); //1s delay before reset

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
      {/* Header components row */}
      <View style={styles.headerRowContainer}>
        <Header ref={buddyHeaderRef}/>
        <ProfileHeader/>
      </View>
      <View style={styles.main}>
        {/* weather image */}
        <View style={styles.weatherPictureContainer}>
          <Image style={styles.weatherPicture} source={imageSource}/>
        </View>

        {/* SPF recommendation */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.highLightYeelow} />
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
            <Text style={styles.heading1}>
              SPF {recommendedSPF}
              <TouchableOpacity onPress={() => showBuddyMessage("spf")}>
                <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
              </TouchableOpacity>
            </Text>

            {isSPFChangedManually ? (
              <Pressable 
                style={styles.btnChange} 
                onPress={resetSPF}
              >
                <Text style={styles.btnChangelabel}>
                  Get Recommended SPF
                  <TouchableOpacity onPress={() => showBuddyMessage("spfBackToRecommended")}>
                    <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
                  </TouchableOpacity>
                </Text>
              </Pressable>
            ) : (
              <TouchableOpacity 
                style={styles.btnChange} 
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              > 
                <Text style={styles.btnChangelabel}>
                  Change SPF
                  <TouchableOpacity onPress={() => showBuddyMessage("spfChange")}>
                    <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
                  </TouchableOpacity>
                </Text>
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
            <Ionicons name="help-circle" color={Colors.highLightYeelow} size={24} style={styles.icon} />
          </TouchableOpacity>
        </Text>

        {/* Reapplication */}
        <View style={styles.ReapplicationContainer}>
          <Text style={styles.label}>
            Reapplication
            <TouchableOpacity onPress={() => showBuddyMessage("reapplication")}>
              <Ionicons name="help-circle" color={Colors.highLightYeelow} size={24} style={styles.icon} />
            </TouchableOpacity>
          </Text>
          
          {isLoading ? (
            <ActivityIndicator size="small" color="yellow" />
          ) : reapplicationTime !== null && reapplicationTime > 0 ? (
            // <CountdownCircleTimer
            //   isPlaying
            //   duration={reapplicationTime}
            //   size={80} 
            //   colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            //   colorsTime={[10, 6, 3, 0]}
            //   onComplete={() => ({ shouldRepeat: true, delay: 2 })}
            // >
            //   {({ remainingTime }) => (
            //     <Text style={styles.countdown}>{formatTime(remainingTime)}</Text>
            //   )}
            // </CountdownCircleTimer>
            <View>
              {/* <Progress.Bar progress={reapplicationTime} width={200} color={Colors.paletteDarkerYellow}/> */}
              {/* <ProgressBar duration={reapplicationTime} /> */}
              <Text style={styles.countdown}>Reapply sunscreen in: {formatTime(reapplicationTime)}</Text>
              {/* Add a button to change reapplication time to 5 sec for testing */}
              {/* <Pressable onPress={() => setReapplicationTime(5)}>
                <Text style={styles.debugButton}>Trigger Timer End</Text>
              </Pressable> */}
              {/* <ActivityIndicator size="small" color={Colors.highLightYeelow} /> */}
            </View>
          ) : reapplicationTime !== null ? (
            <Text style={styles.countdown}>Next in: {formatTime(reapplicationTime)}</Text>
          ) : (
            <Text style={styles.value}>{message}</Text>
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
  heading1: {
    color: Colors.textLight,
    textAlign: 'center',
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  heading2: {
    color: Colors.textLight,
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
    color: Colors.textLight,
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
    color: Colors.highLightYeelow,
  },
  label: {
    fontSize: 20,
    color: Colors.textLight,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.highLightYeelow, 
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
  debugButton: {
    color: Colors.paletteLighterYellow,
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
    textAlign: 'center',
    marginTop: 10,
  }
});
