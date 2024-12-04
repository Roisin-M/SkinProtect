import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { DarkTheme } from '@react-navigation/native'
import { useRouter, useLocalSearchParams } from 'expo-router'

type Props = {}

const SkinQuiz = (props: Props) => {
    const router = useRouter(); //initialize the router
    const { skinType } = useLocalSearchParams(); //get the result from query

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
        marginLeft: 20,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: Colors.lightGrey, // Use a contrasting background color
        marginBottom:20,
        height: '15%',
        width:'90%',
        borderRadius: 10,
        elevation: 5, // Add shadow for Android (optional)
        shadowColor: '#000', // Add shadow for iOS (optional)
        shadowOffset: { width: 0, height: 2 }, // Add shadow for iOS (optional)
        shadowOpacity: 0.2, // Add shadow for iOS (optional)
        shadowRadius: 2, // Add shadow for iOS (optional)
     },
     quizBlock:{
         flexDirection:'column',
         alignItems:'center',
         justifyContent: 'center',
         gap:10,
         padding: 20, // Add some padding around the quizBlock
         width: '100%',
     },
     text:{
         fontSize:16,
         color:Colors.black,
         fontWeight:'400',
         textAlign: 'center',
     },
     button: {
        borderRadius: 10,
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        //flexDirection: 'row',
        backgroundColor: Colors.darkGrey,
     },
     btnLabel: {
        color: '#fff',
        fontSize: 16,
     },
})