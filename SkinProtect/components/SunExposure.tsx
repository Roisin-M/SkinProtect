import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

type Props = {}

const SunExposure = (props: Props) => {
const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sun Exposure</Text>
      <Text style={styles.description}>
        Let's assess your sun exposure today. We need to know what activity you'll be doing and for how long.
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/SunExposureScreen")}
      >
        <Text style={styles.buttonText}>What activity will you be doing?</Text>
      </Pressable>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
   // flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    //padding: 16,
    margin: 16,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,

  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});


export default SunExposure
