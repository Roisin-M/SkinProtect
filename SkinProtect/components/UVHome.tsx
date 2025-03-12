import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/constants/colors';
import React from 'react';

type Props = {
    uvIndex: number | null;
};

const UVHome = ({uvIndex}: Props) => {
  //if statement to display neutral colour if null
    const uvTextColor = uvIndex !== null?
     getUVColor(uvIndex) 
     : Colors.softText;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UV Index</Text>
      <Text style={[styles.uvValue, {color: uvTextColor}]}>
         {uvIndex !== null ? uvIndex.toFixed(1) : "Loading..."}</Text>
         {/* toFixed round to 1 dp */}
    </View>
  );
};

const getUVColor = (uvIndex: number) => {
    if (uvIndex <= 2) return Colors.uvLow; // Low
    if (uvIndex <= 5) return Colors.uvModerate; // Moderate
    if (uvIndex <= 7) return Colors.uvHigh; // High
    if (uvIndex <= 10) return Colors.uvVeryHigh; // Very High
    return Colors.uvExtreme; // Extreme
  };

export default UVHome;

const styles = StyleSheet.create({
    container:{
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
        fontWeight: 'bold',
        color: Colors.softText,
        marginBottom: 8,
      },
      uvValue: {
        fontSize: 24,
        fontWeight: "bold",
      },
});