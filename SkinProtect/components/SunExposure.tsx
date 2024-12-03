import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";  // Make sure you have this dependency

const SunExposure = () => {
  const navigation = useNavigation();

  // Function to navigate to the SunExposure screen when clicked
  const goToSunExposureScreen = () => {
    navigation.navigate('SunExposureScreen'); // Make sure "SunExposure" matches the name of the screen in your navigator
  };

  return (
    <View style={styles.container}>
      {/* TouchableOpacity for Sun Exposure button */}
      <TouchableOpacity onPress={goToSunExposureScreen} style={styles.button}>
        <Text style={styles.text}>Sun Exposure</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FFCC00", // Color for Sun Exposure button
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SunExposure;
