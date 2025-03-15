import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import CustomHeader from '@/components/BackHeader';
import React, {useEffect, useRef, useState} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import skinQuizQuestions from '@/assets/json/skinQuizQuestions.json'
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserSkinType } from '@/services/profileService';
import Header, { BuddyHeaderRef } from '@/components/BuddyHeader';
import ProfileHeader from '@/components/ProfileHeader';
import BackHeader from '@/components/BackHeader';

export default function SkinQuizScreen() {
  // Use the safe area insets
  const { top: safeTop } = useSafeAreaInsets();

  //initialize router
  const router = useRouter();

  //consts for quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  //ref for buddy header
  const buddyHeaderRef = useRef<BuddyHeaderRef>(null);
    
  //const with info messages
  const infoMessages = {
    welcome: "Let’s find out your skin type! Please choose the most accurate answer for each question.",
  };

  //function to automatically show buddy message
  useEffect(() => {
    // Show the welcome message when the component mounts
    showBuddyMessage('welcome');
  
    // Set a timeout to hide the message after a few seconds
    const timer = setTimeout(() => {
      if (buddyHeaderRef.current) {
        buddyHeaderRef.current.updateMessage("", false); // Clear the message
        buddyHeaderRef.current.handleClosePopup(); // Close the popup
      }
    }, 10000); // 10 seconds
  
    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);
    
  //show buddy messages
  const showBuddyMessage = (key: keyof typeof infoMessages) => {
    if (buddyHeaderRef.current) {
      buddyHeaderRef.current.updateMessage(infoMessages[key], true);
    }
  };

  const handleOptionPress = async (score : number) => {
    const newTotalScore = totalScore + score;

    if (currentQuestionIndex < skinQuizQuestions.length - 1) {
      setTotalScore(newTotalScore);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const result = determineSkinType(newTotalScore);
  
      // Save result in AsyncStorage
      await AsyncStorage.setItem('skinType', result);

      try{
        await updateUserSkinType(result);
      } catch(error){
        console.log("failed to update user skin type:", error);
      }
  
      // Navigate back to tabs screen
      router.push('/(tabs)');
    }
    
  };

  const determineSkinType = (score: number) => {
    if (score <= 2) return 'Type I (Very Fair)';
    if (score <= 5) return 'Type II (Fair)';
    if (score <= 8) return 'Type III (Medium)';
    if (score <= 11) return 'Type IV (Olive)';
    if (score <= 13) return 'Type V (Brown)';
    return 'Type VI (Black)';
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setTotalScore(0);
  };

  const renderQuestion = () => {
    const question = skinQuizQuestions[currentQuestionIndex];
    return (
      <View>
        <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.question}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleOptionPress(option.score)}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {paddingTop:safeTop}]}>
      {/* Header components row */}
      <View style={styles.headerRowContainer}>
        <Header ref={buddyHeaderRef}/>
        <ProfileHeader/>
      </View>
      <View style={styles.backHeader}>
        <CustomHeader/> 
      </View>
      <View style={styles.quizContainer}>
        {renderQuestion()}
        <Text style={styles.progress}>
          Question {currentQuestionIndex +1} of {skinQuizQuestions.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.prussianBlue,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
  },
  headerRowContainer: {
    position: 'absolute',
    top: 20, 
    left: 0, 
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  backHeader: {
    position: 'absolute', // For fixed positioning in React Native
    top: 50,
    left: 15,
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  questionContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  question: {
    color: Colors.white,
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  option: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 10,
    width: 300, 
    height: 50, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: Colors.darkBackground,
    fontSize: 18,
  },
  progress: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 20,
  },
});
