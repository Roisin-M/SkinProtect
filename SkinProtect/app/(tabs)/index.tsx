import { View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, StatusBar, TextInput } from 'react-native';
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
//authentication
import ProfileHeader from '@/components/ProfileHeader';



export default function Index() {
  const [recommendedSPF, setRecommendedSPF] = useState<string | number>('...');
  const [isLoading, setIsLoading] = useState(true);
  const { top: safeTop } = useSafeAreaInsets();
  const [uvIndex, setUvIndex] = useState<number | null>(null);

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
  // const clearAsyncStorage = async () => {
  //   await AsyncStorage.clear();
  //   console.log('AsyncStorage cleared');
  // };

  // // Clear AsyncStorage on component mount
  // useEffect(() => {
  //   clearAsyncStorage();
  // }, []);

  //image source to be changed as needed
  const [imageSource, setImageSource] = useState(require('../../assets/images/sun.png'));

  //const to keep track of day/night time
  let dayTime = true;
  
  //method to determine if it is day or night
  // useEffect(() => {
  //   const currentHour = new Date().getHours();
  //   if (currentHour >= 6 && currentHour < 18){
  //     //daytime
  //     setImageSource(require('../../assets/images/sun.png'));
  //   } else {
  //     //nighttime
  //     dayTime = false;
  //     setImageSource(require('../../assets/images/moon.png'));
  //   }
  // }, []);


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
              if (storedUvIndex) setUvIndex(parseFloat(storedUvIndex));

              // Calculate the SPF
              const spf = await calculateSPF(uvDailyData, skinTypeStr);
              if (isActive) {
                setRecommendedSPF(spf);
              }
            } else {
              setRecommendedSPF('Not Needed');
            }
            
          }
        } catch (error) {
          console.error('Error in SummaryScreen fetching SPF:', error);
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

        <Text style={styles.heading1}>
          SPF {recommendedSPF}
          <TouchableOpacity onPress={() => showBuddyMessage("spf")}>
            <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
          </TouchableOpacity>
        </Text>

        <Text style={styles.heading2}>
          Current UV Index: {uvIndex !== null ? uvIndex : 'N/A'}
          <TouchableOpacity onPress={() => showBuddyMessage("uvIndex")}>
            <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
          </TouchableOpacity>
        </Text>

        <View style={styles.ReapplicationContainer}>
          <Text style={styles.label}>Reapplication: 
            <TouchableOpacity onPress={() => showBuddyMessage("reapplication")}>
              <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
            </TouchableOpacity>
          </Text>
          
          {reapplicationTime !== null ? (
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
  },
  heading1: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 16,
    margin: 10,
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
});
