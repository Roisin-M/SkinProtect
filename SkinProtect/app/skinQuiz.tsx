import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';
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
import { determineSkinType, calculateNewScore } from '@/services/skinTypeDeterminationLogic';

const { height, width } = Dimensions.get('window'); // Get screen dimensions

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
    welcome: "Let’s find out your skin type! Please choose the most accurate answer for each question. 🧴✨",
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
    const newTotalScore = calculateNewScore(totalScore, score);

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
      router.push('/(tabs)/summary');
    }
    
  };

  // const resetQuiz = () => {
  //   setCurrentQuestionIndex(0);
  //   setTotalScore(0);
  // };

  const renderQuestion = () => {
    const question = skinQuizQuestions[currentQuestionIndex];

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.question}</Text>
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
      <View style={styles.headerContainer}>
        <Header ref={buddyHeaderRef} />
        <ProfileHeader />
      </View>

      {/* Back Button */}
      <View style={styles.backHeader}>
        <BackHeader />
      </View>

      {/* Quiz Content */}
      <View style={styles.quizContainer}>
        {renderQuestion()}
        <Text style={styles.progress}>
          Question {currentQuestionIndex + 1} of {skinQuizQuestions.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.prussianBlue,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backHeader: {
    marginTop: 10, // Push below header
    paddingHorizontal: 20,
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  questionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  question: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  option: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 10,
    width: width * 0.8, // 80% of screen width
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
    fontSize: 16,
    marginTop: 20,
  },
});
