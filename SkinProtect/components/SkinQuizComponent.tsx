import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { DarkTheme } from '@react-navigation/native'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebaseConfig'
import { fetchUserProfile, updateUserSkinType } from '@/services/profileService'

type Props = {}

const SkinQuiz = (props: Props) => {
    const router = useRouter(); //initialize the router
    //const { skinType } = useLocalSearchParams(); //get the result from query
    const [skinType, setSkinType] = useState<string | null>(null);

    const loadSkinType = async () => {
        const user = auth.currentUser;
        if (user) {
          // If logged in => check Firestore
          const profile = await fetchUserProfile();
          if (profile && profile.skinType) {
            setSkinType(profile.skinType);
            return; // done
          }
        }
        // If logged out OR no skinType in doc fallback to AsyncStorage
        const storedSkinType = await AsyncStorage.getItem('skinType');
        if (storedSkinType) {
          setSkinType(storedSkinType);
        } else {
          setSkinType(null);
        }
      };
    
      // On first mount, load once
      useEffect(() => {
        loadSkinType();
      }, []);
    
      //re-load every time screen in focus
      useFocusEffect(
        React.useCallback(() => {
          loadSkinType();
        }, [])
      );
      

    return (
        <View style={styles.container}>
            <View style={styles.quizBlock}>
                <Text style={styles.text}>
                    { skinType ? `Your skin type: ${skinType}` : "Let’s find out your skin type!"}
                </Text>
                <Pressable 
                    style={styles.button} 
                    //navigate to skinQuiz screen
                    onPress={() => router.push('/skinQuiz')}> 
                    <Text style={styles.btnLabel}>
                        {skinType ? 'Retake Quiz' : 'Start Quiz'}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

export default SkinQuiz

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        //alignItems:'center',
        backgroundColor: Colors.background, 
        margin: 16,
        height: '15%',
        // width:'90%',
        borderRadius: 10,
     },
     quizBlock:{
         flexDirection:'column',
         //alignItems:'center',
         justifyContent: 'center',
         gap:10,
         padding: 20, 
         width: '100%',
     },
     text:{
         fontSize: 16,
         fontWeight: 'bold',
         color: Colors.softText,
         textAlign: 'left',
     },
     button: {
        borderRadius: 10,
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: Colors.prussianBlue,
     },
     btnLabel: {
        color: Colors.textLight,
        fontSize: 16,
     },
})