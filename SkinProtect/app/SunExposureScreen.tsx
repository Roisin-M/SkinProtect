//Sun Exposure Screen Page
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type SunExposureScreenProps = {
  onSubmit: (activity: string, timeSpent: string) => void;
};

const SunExposureScreen = () => {
  const [activity, setActivity] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const router = useRouter();

  const handleActivitySelect = (selectedActivity: string) => {
    setActivity(selectedActivity);
  };

  const handleSubmit = () => {
    if (!activity || !timeSpent) {
      alert('Please select an activity and enter the time spent.');
      return;
    }
    router.push({
      pathname: '/(tabs)',
      params: { activity, timeSpent }, // Pass parameters to the main screen
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What activity will you be doing today?</Text>
      <View style={styles.iconContainer}>
        <Pressable
          style={[styles.iconWrapper, activity === 'Relaxing' && styles.active]}
          onPress={() => handleActivitySelect('Relaxing')}
        >
          <FontAwesome5 name="umbrella-beach" size={30} color={activity === 'Relaxing' ? 'blue' : 'gray'} />
          <Text style={styles.iconText}>Relaxing</Text>
        </Pressable>
        <Pressable
          style={[styles.iconWrapper, activity === 'Running/Walking' && styles.active]}
          onPress={() => handleActivitySelect('Running/Walking')}
        >
          <FontAwesome5 name="running" size={30} color={activity === 'Running/Walking' ? 'blue' : 'gray'} />
          <Text style={styles.iconText}>Running/Walking</Text>
        </Pressable>
        <Pressable
          style={[styles.iconWrapper, activity === 'Driving' && styles.active]}
          onPress={() => handleActivitySelect('Driving')}
        >
          <FontAwesome5 name="car" size={30} color={activity === 'Driving' ? 'blue' : 'gray'} />
          <Text style={styles.iconText}>Driving</Text>
        </Pressable>
      </View>
      <Text style={styles.description}>How long will you be outside (in minutes)?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter time in minutes"
        value={timeSpent}
        keyboardType="numeric"
        onChangeText={setTimeSpent}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
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
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  active: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 10,
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '80%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})

export default SunExposureScreen;