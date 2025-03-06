//Sun Exposure Screen Page
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SunExposureScreenProps = {
  onSubmit: (activity: string, timeSpent: string) => void;
};

const SunExposureScreen = () => {
  const [activity, setActivity] = useState('');
  const [exposure, setExposure] = useState('');
  const [result, setResult] = useState('');
  
  const router = useRouter();

  const handleActivitySelect = (selectedActivity: string) => {
    setActivity(selectedActivity);
  };
  const handleExposureSelect = (selectedExposure:string) => {
    setExposure(selectedExposure);
  };

  const handleSubmit = async () => {
    let result = '';
    if (activity === 'Mostly Inside') {
      result = 'Case 1: Apply SPF in the morning.';
  } else if (activity === 'Both' || activity === 'Mostly Outside') {
      if (exposure === 'Exposed') {
          result = 'Case 2: Re-apply every 2 hours.';
      } else if (exposure === 'Not Exposed') {
          result = 'Case 3: TBC';
      }
  }
  setResult(result);

     // Store both in AsyncStorage
     await AsyncStorage.setItem('activity', activity)
     await AsyncStorage.setItem('exposure', exposure)
     await AsyncStorage.setItem('exposureResult', result)
 
     // Then just go back to the tabs. No need for query params now.
     router.push('/(tabs)')
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>ACTIVITIES OPTIONS</Text>
        <Text style={styles.description}>Where will you be today:</Text>

        <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, activity === 'Mostly Inside' ? styles.active : null]} onPress={() => handleActivitySelect('Mostly Inside')}>
            <FontAwesome5 name="home" size={50} color="white" />
                <Text style={styles.buttonText}>Mostly Inside</Text>
            </Pressable>
            
            <Pressable style={[styles.button, activity === 'Both' ? styles.active : null]} onPress={() => handleActivitySelect('Both')}>
            <FontAwesome5 name="adjust" size={50} color="white" />
                <Text style={styles.buttonText}>Both</Text>
            </Pressable>

            <Pressable style={[styles.button, activity === 'Mostly Outside' ? styles.active : null]} onPress={() => handleActivitySelect('Mostly Outside')}>
            <FontAwesome5 name="sun" size={50} color="white" />
                <Text style={styles.buttonText}>Mostly Outside</Text>
            </Pressable>
        </View>
        {(activity === 'Both' || activity === 'Mostly Outside') && (
            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button, exposure === 'Exposed' ? styles.active : null]} onPress={() => handleExposureSelect('Exposed')}>
                    <Text style={styles.buttonText}>Exposed to the Sun</Text>
                </Pressable>
                
                <Pressable style={[styles.button, exposure === 'Not Exposed' ? styles.active : null]} onPress={() => handleExposureSelect('Not Exposed')}>
                    <Text style={styles.buttonText}>Not Exposed</Text>
                </Pressable>
            </View>
        )}
        
        <Text style={styles.result}>{result}</Text>
 
     <Pressable style={[styles.button]} onPress={() => handleSubmit()}>
     <Text style={styles.buttonText}>SUBMIT</Text>
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
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 50,
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
    backgroundColor: 'green',
    borderRadius: 50,
    padding: 20,
  },
  iconText: {
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 50,
},
buttonContent: {
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'center',
  gap: 50, 
},

  description: {
    fontSize: 30,
    marginVertical: 10,
    fontWeight: '800',
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
    backgroundColor: 'orange',
    padding: 20,
    borderRadius: 50,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
  },
  result: {
    marginTop: 70,
    fontSize: 35,
    fontWeight: '800',
    color: 'black',
},
})

export default SunExposureScreen;