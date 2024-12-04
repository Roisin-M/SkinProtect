import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/colors'

type Props = {}

const LocationHome = (props: Props) => {
  return (
    <View style={styles.container}>
    {/* Display City Name */}
    <Text style={styles.cityName}>Your City</Text>

    {/* Buttons Side by Side */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.btn} onPress={() => console.log('Auto-location')}>
        <Text style={styles.btnText}>Auto-Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => console.log('Manual location')}>
        <Text style={styles.btnText}>Manual Location</Text>
      </TouchableOpacity>
    </View>
  </View>
  )
}

export default LocationHome

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
        fontWeight: "600",
        color: Colors.softText,
        marginBottom: 8,
      },
      cityName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.softText,
        marginBottom: 10, // Add space below city name
        textAlign: 'center',
      },
      buttonContainer: {
        flexDirection: "row", // Position buttons side by side
        justifyContent: "space-between", // Space between buttons
        width: "100%", // Full width of the container
      },
      btn: {
        backgroundColor: Colors.blue,
        paddingVertical: 12,
        paddingHorizontal: 5,
        marginHorizontal:5,
        borderRadius: 10,
        alignItems: 'center',
        flex:1,
      },
      btnText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
      },
      
})