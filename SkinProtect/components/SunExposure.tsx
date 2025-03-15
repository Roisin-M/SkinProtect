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
    const [result, setResult] = useState<string | null>(null)

    useEffect(() => {
      // On mount, retrieve from AsyncStorage
      const loadData = async () => {
        const storedActivity = await AsyncStorage.getItem('activity')
        const storedExposure = await AsyncStorage.getItem('exposure')
        const storedResult = await AsyncStorage.getItem('exposureResult')
        if (storedActivity) setActivity(storedActivity)
        if (storedExposure) setExposure(storedExposure) 
        if (storedResult) setResult(storedResult)
          
      }
      loadData()
    }, [])

    const clearData = async () => {
      await AsyncStorage.multiRemove(['activity', 'exposure', 'exposureResult']);
      setActivity(null);
      setExposure(null);
      setResult(null);
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sun Exposure</Text>
      {activity && exposure ? (
        <View style={styles.activitiesContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Activity: {activity}</Text>
            <Text style={styles.infoText}>Exposure: {exposure} </Text>
          </View>
          <Pressable
            style={styles.button}
            onPress={() => router.push('/SunExposureScreen')}
          >
            <Text style={styles.buttonText}>Update</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.activitiesContainer}>
          <Text style={styles.description}>Let's get your activities and exposure for today!</Text>
          <Pressable
            style={styles.button}
            onPress={() => router.push('/SunExposureScreen')}
          >
            <Text style={styles.buttonText}>Add activities</Text>
          </Pressable>
        </View>
      )}
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
    fontSize: 20,
    fontWeight: "600",
    color: Colors.softText,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.softText,
    marginBottom: 8,
  },
  activitiesContainer: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.prussianBlue,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginTop:10,
    width: '50%',
    textAlign: 'center',
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: 16,
    textAlign: 'center',
  },
  infoBox:{
    textAlign: 'left',
    width:'100%',
  },
  infoText: {
    fontSize: 16,
    color: Colors.softText,
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.softText,
  },
});


export default SunExposure
