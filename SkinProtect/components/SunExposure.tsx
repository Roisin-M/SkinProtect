//Sun Exposure Component file
import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SunExposure = () => {
  const router = useRouter();
  //const { activity, timeSpent } = useLocalSearchParams(); // Retrieve passed parameters
    // Local states to show what we loaded
    const [activity, setActivity] = useState<string | null>(null)
    const [exposure, setExposure] = useState<string | null>(null)


    useEffect(() => {
      // On mount, retrieve from AsyncStorage
      const loadData = async () => {
        const storedActivity = await AsyncStorage.getItem('activity')
        const storedExposure = await AsyncStorage.getItem('exposure')
        if (storedActivity) setActivity(storedActivity)
        if (storedExposure) setExposure(storedExposure) 
          
      }
      loadData()
    }, [])
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ACTIVITIES OPTIONS</Text>
        <Text style={styles.description}>
          Let's assess your SUN EXPOSURE for the day!
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/SunExposureScreen")}
        >
          <Text style={styles.buttonText}>How much sun exposure will you have today? $</Text>
          <Text>
          { exposure ? `Your skin type: ${exposure}` : "Lets find out your skin type!"}
          </Text>
        </Pressable>
      </View>
    );
  };
  


const styles = StyleSheet.create({
  container: {
   // flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    //padding: 16,
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.softText,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginTop:5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.softText,
  },
});


export default SunExposure
