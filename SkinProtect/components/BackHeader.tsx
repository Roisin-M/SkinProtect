// components/CustomHeader.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/colors'


const CustomHeader = () => {
  // const router = useRouter();

  // return (
  //   <View style={styles.container}>
  //     <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
  //       <Ionicons name="arrow-back" size={20} color="#fff">
  //           <Text style={styles.title}>Go Back</Text>
  //       </Ionicons>
  //     </TouchableOpacity>
      
  //   </View>
  // );
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </Text> {/* or use an icon */}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  //new styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.prussianBlue, // Match your background
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,

  },
});

export default CustomHeader;
