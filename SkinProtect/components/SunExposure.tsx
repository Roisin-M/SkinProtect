//Sun Exposure Component file
import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

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
    fontSize: 16,
    fontWeight:"600",
    marginBottom: 8,

  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});


export default SunExposure
