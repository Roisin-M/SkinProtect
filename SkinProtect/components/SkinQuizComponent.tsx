import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { DarkTheme } from '@react-navigation/native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {}

const SkinQuiz = (props: Props) => {
    const router = useRouter(); //initialize the router
    //const { skinType } = useLocalSearchParams(); //get the result from query
    const [skinType, setSkinType] = useState<string | null>(null);

    useEffect(() => {
        //load stored skin type when component mounts
        const loadSkinType = async () => {
            const storedSkinType = await AsyncStorage.getItem('skinType');
            if (storedSkinType) {
                setSkinType(storedSkinType);
            }
        };

        loadSkinType();
    }, []);

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
         fontWeight: "600",
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

        //flexDirection: 'row',
        backgroundColor: Colors.blue,
     },
     btnLabel: {
        color: '#fff',
        fontSize: 16,
     },
})