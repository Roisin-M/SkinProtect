import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { ActivityIndicator, Text, View,  StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SunExposure from "@/components/SunExposure";
import SunExposureScreen from '../SunExposureScreen';
import UVHome from '@/components/UVHome';
import { getCurrentUvi} from '@/services/OpenWeatherService';
//location imports
import LocationHome from '@/components/LocationHome';
import Header from '@/components/BuddyHeader'
import SkinQuiz from '@/components/SkinQuizComponent';
//import for storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; 
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { calculateSPF } from '@/services/CalculateRecommendedSPF';
import Header from '@/components/BuddyHeader';
import { Ionicons } from '@expo/vector-icons';


export default function Index() {
  const [recommendedSPF, setRecommendedSPF] = useState<string | number>('...');
  const [isLoading, setIsLoading] = useState(true);
  const { top: safeTop } = useSafeAreaInsets();
  const [uvIndex, setUvIndex] = useState<number | null>(null);

  //pop ups with explanations
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');

  //mock user activity
  const [activity, setActivity] = useState("outdoor_direct");

  //reapplication states
  const [reapplicationTime, setReapplicationTime] = useState<number | null>(null); // Countdown in seconds
  const [message, setMessage] = useState<string | null>(null);

  //function to open the modal with specific text
  const showModal = (text:string) => {
    setModalText(text);
    setModalVisible(true);
  };

  // Re-run every time this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setIsLoading(true);
        try {
          // 1) Get UV + Skin Type from AsyncStorage
          const uvIndex = await AsyncStorage.getItem('uvIndex');
          const skinTypeStr = await AsyncStorage.getItem('skinType'); 

          // If missing, default to 'N/A'
          if (!uvIndex || !skinTypeStr) {
            if (isActive) {
              setRecommendedSPF('N/A');
              setUvIndex(null);
            }
          } else {
            const uvNumber = parseFloat(uvIndex);
            setUvIndex(uvNumber);

            // Calculate the SPF
            const spf = await calculateSPF(uvNumber, skinTypeStr);
            if (isActive) {
              setRecommendedSPF(spf);
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
    if (activity === "outdoor_direct" && uvIndex && uvIndex > 6 ) {
      //high uv -> reapply every 2 hours (7200 seconds)
      setReapplicationTime(7200);
      setMessage(null);
    } else {
      //indoor or low uv = apply once in the morning
      setReapplicationTime(null);
      setMessage("Apply once in the morning, no need to reapply.");
    
// Whenever lat/lon changes, fetch UV and persist
const handleLocationUpdate = async (lat: number, lon: number) => {
  try {
    setLatitude(lat)
    setLongitude(lon)
    await AsyncStorage.setItem('latitude', String(lat))
    await AsyncStorage.setItem('longitude', String(lon))

    const uvData = await getCurrentUvi(lat, lon)
    setUvIndex(uvData)

    // Optionally also store uvIndex so we can show it even before re-fetch
    if (uvData !== null) {
      await AsyncStorage.setItem('uvIndex', String(uvData))
    }
  }, [activity, uvIndex]);

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
      <Header />

      {/* Content below the header */}
      <View style={styles.infoContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            {/* UV Index Row */}
            <View style={styles.row}>
              <Text style={styles.heading}>
                Current UV Index: {uvIndex !== null ? uvIndex : 'N/A'}
              </Text>
              <TouchableOpacity onPress={() => showModal("UV Index measures the level of ultraviolet radiation from the sun. Higher values mean stronger UV exposure and greater risk of skin damage.")}>
                <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
              </TouchableOpacity>
            </View>

            {/* SPF Recommendation Circle */}
            <View style={styles.SPFContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Recommended SPF:</Text>
                <TouchableOpacity onPress={() => showModal("SPF (Sun Protection Factor) indicates how well sunscreen protects against UVB rays. Higher SPF provides stronger protection.")}>
                  <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.value}>{recommendedSPF}</Text>
            </View>

            {/* Reapplication section */}
            <View style={styles.ReapplicationContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Reapplication:</Text>
                <TouchableOpacity onPress={() => showModal("Reapplying sunscreen is crucial for maintaining effective protection against UV radiation. The frequency of reapplication depends on your activity and the UV index. If you are outdoors in direct sunlight for extended periods, sunscreen should be reapplied regularly to maintain its effectiveness. In contrast, if you spend most of your time indoors, a single morning application may be sufficient. Always reapply every 2 hours if sweating, swimming, or exposed to strong UV rays.")}>
                  <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
                </TouchableOpacity>
              </View>
              {reapplicationTime !== null ? (
                <Text style={styles.countdown}>Next in: {formatTime(reapplicationTime)}</Text>
              ) : (
                <Text style={styles.value}>{message}</Text>
              )}
            </View>
          </>
        )}
      </View>

      {/* Modal for Info */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalText}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
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
  SPFContainer:{
    backgroundColor: '#323644',
    borderRadius: 100,
    width: 200,
    height:200,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  ReapplicationContainer:{
    backgroundColor: '#323644',
    borderRadius: 10,
    width: 300,
    height:200,
    paddingTop: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  countdown: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#ffef00'
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffef00', 
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#25292e',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
