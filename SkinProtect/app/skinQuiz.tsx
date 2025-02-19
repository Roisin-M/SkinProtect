import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import CustomHeader from '@/components/BackHeader';
import React, {useState} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import skinQuizQuestions from '@/assets/json/skinQuizQuestions.json'
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SkinQuizScreen() {
  // Use the safe area insets
  const { top: safeTop } = useSafeAreaInsets();

  //initialize router
  const router = useRouter();

  //consts for quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  //method to calculate answer points to determine the skin type
  // const handleOptionPress = (score: number) => {
  //   //setTotalScore(totalScore+score);
  //   const newTotalScore = totalScore + score;

  //   //check if it is the last question
  //   if (currentQuestionIndex < skinQuizQuestions.length - 1) {
  //     setTotalScore(newTotalScore);
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //   } else {
  //     //determine Fitzpatrick scale result
  //     const result = determineSkinType(newTotalScore);
      
  //     // Alert.alert('Quiz Completed', `Your skin type is: ${result}`, [
  //     //   { 
  //     //     text: 'OK', 
  //     //     onPress: () => {
  //     //       router.push({
  //     //         pathname:'/(tabs)',
  //     //         params: {skinType: result }, //pass the skintype result as parameter
  //     //       })
  //     //     } 
  //     //   },
  //     // ]);

  //     //navigate to the previous page with the skin type result
  //     router.push({
  //       pathname: '/(tabs)',
  //       params: { skinType: result }, //Pass the skin type result as a parameter
  //     })
  //   }
  // };

  const handleOptionPress = async (score : number) => {
    const newTotalScore = totalScore + score;

    if (currentQuestionIndex < skinQuizQuestions.length - 1) {
      setTotalScore(newTotalScore);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const result = determineSkinType(newTotalScore);
  
      // Save result in AsyncStorage
      await AsyncStorage.setItem('skinType', result);
  
      // Navigate back to tabs screen
      router.push('/(tabs)');
    }
    
  };

  const determineSkinType = (score: number) => {
    if (score <= 7) return 'Type I (Very Fair)';
    if (score <= 13) return 'Type II (Fair)';
    if (score <= 19) return 'Type III (Medium)';
    if (score <= 25) return 'Type IV (Olive)';
    if (score <= 31) return 'Type V (Brown)';
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
      <CustomHeader/> 
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
    backgroundColor: Colors.darkBackground,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
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
    fontSize: 18,
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
    fontSize: 16,
  },
  progress: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 20,
  },
});
