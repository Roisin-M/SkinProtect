//Sun Exposure Screen Page
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import CustomHeader from '@/components/BackHeader';
import Header, { BuddyHeaderRef } from '@/components/BuddyHeader';

export default function SunExposureScreen() {
  const [activity, setActivity] = useState('');
  const [exposure, setExposure] = useState('');
  const [result, setResult] = useState('N/A');
  const [caseNumber, setCaseNumber] = useState(0);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide the header
  }, [navigation]);

  const { top: safeTop } = useSafeAreaInsets();
  
  //ref for buddy header
    const buddyHeaderRef = useRef<BuddyHeaderRef>(null);
  
    //const with info messages
    const infoMessages = {
      activities: "Knowing what type of activities you’ll be doing today is super important! Different activities expose you to the sun in different ways ☀️🌳. Let’s figure out how much sun you’ll get today! 🌞",
      exposure: "Understanding your exposure helps with choosing the right sunscreen 🧴☀️ and how often to apply it ⏰, so your skin stays safe while you enjoy your day!",
    };
  
    //show buddy messages
    const showBuddyMessage = (key: keyof typeof infoMessages) => {
      if (buddyHeaderRef.current) {
        buddyHeaderRef.current.updateMessage(infoMessages[key], true);
      }
    };

  const handleActivitySelect = (selectedActivity: string) => {
    setActivity(selectedActivity);
    //reset exposure when a new activity is selected
    setExposure('');
  };

  const handleExposureSelect = (selectedExposure:string) => {
    setExposure(selectedExposure);
  };

  const handleSubmit = async () => {
    //make sure options are selected
    if (!activity) {
      Alert.alert('Selection Required', 'Please select type of activities before submitting.')
      return;
    }
    if ((activity === 'Both' || activity === 'Mostly Outside') && !exposure) {
      Alert.alert('Selection Required', 'Please select whether you will be exposed to the sun before submitting.')
      return;
    }

    let caseNumber = 0;
    let message = 'N/A'; //default to N/A

    //figure out case number and message
    if (activity === 'Mostly Inside' || (activity === 'Both' && exposure === 'Not Exposed')) {
        caseNumber = 1;
        message = 'Apply SPF only in the morning.';
    } else if ((activity === 'Both' && exposure === 'Exposed') || (activity === 'Mostly Outside' && exposure === 'Not Exposed')) {
        caseNumber = 2;
        message = 'Reapply SPF every 4 hours.';
    } else if (activity === 'Mostly Outside' && exposure === 'Exposed') {
      caseNumber = 3;
      message = 'Reapply SPF every 2 hours.';
    }

    setCaseNumber(caseNumber);
    setResult(message);

    // Store data in AsyncStorage
    await AsyncStorage.setItem('activity', activity);
    await AsyncStorage.setItem('exposure', exposure);
    //await AsyncStorage.setItem('caseNumber', caseNumber.toString());
    //await AsyncStorage.setItem('exposureResult', message);

    //go back to the previous screen
    router.push('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
        <CustomHeader />
        <View style={styles.headerContainer}>
          <Header ref={buddyHeaderRef}/>
        </View>

        <Text style={styles.title}> 
          What type of activities will you be doing today?
          <TouchableOpacity onPress={() => showBuddyMessage("activities")}>
              <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
          </TouchableOpacity>
        </Text>
        <View style={styles.buttonContainer}>
            {['Mostly Inside', 'Both', 'Mostly Outside'].map((option) => (
              <Pressable
                key={option}
                style={[styles.button, activity === option ? styles.active : null]}
                onPress={() => handleActivitySelect(option)}
              >
                <Text style={styles.buttonText}>{option}</Text>
              </Pressable>
            ))}
        </View>

        {(activity === 'Both' || activity === 'Mostly Outside') && (
          <>
            <Text style={styles.subtitle}>
              Will you be exposed to the sun?
              <TouchableOpacity onPress={() => showBuddyMessage("exposure")}>
                <Ionicons name="help-circle" color="yellow" size={24} style={styles.icon} />
              </TouchableOpacity>
            </Text>
            <View style={styles.buttonContainer}>
              {['Exposed', 'Not Exposed'].map((exposureOption) => (
                <Pressable
                  key={exposureOption}
                  style={[styles.button, exposure === exposureOption ? styles.active : null]}
                  onPress={() => handleExposureSelect(exposureOption)}
                >
                  <Text style={styles.buttonText}>{exposureOption}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}           
        <View style={styles.submitButtonContainer}>
          <Pressable style={styles.submitButton} onPress={() => handleSubmit()}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </Pressable>
        </View>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.prussianBlue,
  },
  headerContainer: {
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 80,
    textAlign: 'center',
    color: Colors.textLight,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: Colors.textLight,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
  },
  button: {
    backgroundColor: Colors.textLight,
    padding: 10,
    borderRadius: 5,
    width: '30%',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: Colors.paletteDark,
    fontSize: 20,
    textAlign: 'center',
  },
  submitButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the submit button
    width: '100%',
    marginTop: 80,
  },
  submitButton: {
    backgroundColor: Colors.blueGreen,
    padding: 10,
    borderRadius: 5,
    width: '50%',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: Colors.paletteDark,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: Colors.skyBlue,
  },
  icon: {
    marginLeft: 8,
  },
});

//export default SunExposureScreen;