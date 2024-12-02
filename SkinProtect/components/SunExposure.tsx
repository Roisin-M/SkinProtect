// Input component for the sun exposure time
import React, { useState } from 'react';
import { TextInput, StyleSheet, Text, View, Button } from 'react-native';

type SunExposureProps = {
  onSubmit: (exposureTime: string) => void; // Function to handle the submission
};

const SunExposure = ({ onSubmit }: SunExposureProps) => {
  const [exposureTime, setExposureTime] = useState('');

  const handleSubmit = () => {
    onSubmit(exposureTime); // Pass the value back to the parent screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How long do you plan to be in the sun?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter time in hours"
        value={exposureTime}
        onChangeText={setExposureTime}
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
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
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
});

export default SunExposure;
