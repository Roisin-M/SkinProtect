//Sun Exposure Screen Page
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


const SunExposureScreen = () => {
  const [activity, setActivity] = useState('');
  const [exposure, setExposure] = useState(''); // Added this line
  
    let result = '';

    const handleActivitySelect = (selectedActivity:string) => {
        setActivity(selectedActivity);
        setExposure('');
    };
    const handleExposureSelect = (selectedExposure:string) => {
      setExposure(selectedExposure);
  };


  if (activity === 'Mostly Inside') {
    result = 'Case 1: Apply SPF in the morning.';
} else if (activity === 'Both' || activity === 'Mostly Outside') {
    if (exposure === 'Exposed') {
        result = 'Case 2: Re-apply every 2 hours.';
    } else if (exposure === 'Not Exposed') {
        result = 'Case 3: TBC';
    }
}

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ACTIVITIES OPTIONS</Text>
            <Text style={styles.description}>Where will you be today:</Text>

            <View style={styles.buttonContainer}>
                <Pressable style={[styles.button, activity === 'Mostly Inside' ? styles.active : null]} onPress={() => handleActivitySelect('Mostly Inside')}>
                    <Text style={styles.buttonText}>Mostly Inside</Text>
                </Pressable>
                
                <Pressable style={[styles.button, activity === 'Both' ? styles.active : null]} onPress={() => handleActivitySelect('Both')}>
                    <Text style={styles.buttonText}>Both</Text>
                </Pressable>

                <Pressable style={[styles.button, activity === 'Mostly Outside' ? styles.active : null]} onPress={() => handleActivitySelect('Mostly Outside')}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    active: {
        backgroundColor: '#e0f7fa',
    },
    result: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
    },
});

export default SunExposureScreen;