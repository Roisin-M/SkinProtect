import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/colors'


export default function BackHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.container} >
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>
          <Ionicons name="arrow-back" size={35} color={Colors.highLightYeelow} />
        </Text> 
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 100,
    marginLeft: 1,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

