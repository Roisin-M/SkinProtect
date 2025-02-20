import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; 
import React, { useState } from 'react'
import { calculateSPF } from '@/services/CalculateRecommendedSPF';

export default function SummaryScreen() {
  const [recommendedSPF, setRecommendedSPF] = useState<string | number>('...');
  const [isLoading, setIsLoading] = useState(true);


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
            }
          } else {
            const uvNumber = parseFloat(uvIndex);
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Summary</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Recommended SPF:</Text>
          <Text style={styles.value}>
            {recommendedSPF}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#323644',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
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
});
