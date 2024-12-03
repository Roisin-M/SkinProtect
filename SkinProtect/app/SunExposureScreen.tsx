import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const SunExposureScreen = () => {
  const [activity, setActivity] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [isActivityScreen, setIsActivityScreen] = useState(false);

  const handleSubmit = () => {
    // Submit logic, maybe calculate sunscreen recommendations
    console.log('Activity:', activity, 'Time:', timeSpent);
  };

  return (
    <View style={styles.container}>
      {!isActivityScreen ? (
        <View>
          <Text style={styles.title}>Sun Exposure</Text>
          <Text style={styles.description}>
            Let's assess your sun exposure today. We need to know what activity you'll be doing and for how long.
          </Text>
          <Pressable style={styles.button} onPress={() => setIsActivityScreen(true)}>
            <Text style={styles.buttonText}>What activity will you be doing?</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>What activity will you be doing today?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter activity (e.g., walking, swimming)"
            value={activity}
            onChangeText={setActivity}
          />
          <TextInput
            style={styles.input}
            placeholder="How long will you be outside (in minutes)?"
            value={timeSpent}
            keyboardType="numeric"
            onChangeText={setTimeSpent}
          />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default SunExposureScreen;
