import React from 'react';
import { View, StyleSheet } from 'react-native';
import SunExposure from '../components/SunExposure';

const SunExposureScreen = () => {
  return (
    <View style={styles.container}>
      <SunExposure />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SunExposureScreen;
