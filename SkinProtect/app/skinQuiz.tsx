import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert, Button, Pressable } from 'react-native';
import CustomHeader from '@/components/BackHeader';
import React, {useState} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import skinQuizQuestions from '@/assets/json/skinQuizQuestions.json'
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserSkinType } from '@/services/profileService';
import SkinTypeCamera from '@/components/SkinTypeCamera';

export default function SkinQuizScreen() {
  // Use the safe area insets
  const { top: safeTop } = useSafeAreaInsets();

  //initialize router
  const router = useRouter();

  const [detectedSkinType, setDetectedSkinType] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  //get the detected skin tone from user's photo
  const handleSkinToneDetected = async (type: string) => {
    setDetectedSkinType(type); // Update state
    setShowCamera(false); // Hide camera after capture

    try {
        await AsyncStorage.setItem("skinType", type);
        console.log("Stored skin type:", type);
    } catch (error) {
        console.error("Error saving skin type:", error);
    }

    router.push('/(tabs)');
  };


  return (
    <View style={[styles.container, {paddingTop:safeTop}]}>
        <SkinTypeCamera onSkinToneDetected={handleSkinToneDetected} />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.prussianBlue,
  },
  text: {
    color: Colors.textLight,
    fontSize: 25,
  },
  button: {
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: Colors.paletteDarkerYellow,
  },
  btnLabel: {
      color: Colors.textLight,
      fontSize: 16,
  },

});
