// the screen that uses the SunExposure component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SunExposure from '@/components/SunExposure'; // Import the SunExposure component

const SunExposureScreen = () => {
  const handleExposureSubmit = (exposureTime: string) => {
    console.log(`User plans to be in the sun for ${exposureTime} hours.`);
    // You can now use the exposureTime for further processing
    // For example, navigate to the next step or store the data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Your Sun Exposure</Text>
      <SunExposure onSubmit={handleExposureSubmit} /> {/* Use the SunExposure input component */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SunExposureScreen;
