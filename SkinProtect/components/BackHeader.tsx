// components/CustomHeader.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors'


const CustomHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color="#fff">
            <Text style={styles.title}>Go Back</Text>
        </Ionicons>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25292e',
    position: 'absolute', // Make it absolute
    top: 0, // Position it at the top
    left: 0,
    right: 0, 
    marginTop: '10%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey, 
  },
  backButton: {
    flexDirection: 'row',
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,

  },
});

export default CustomHeader;
