import { ActivityIndicator, Text, View,  StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/BuddyHeader'
import SkinQuiz from '@/components/SkinQuizComponent';

export default function Index() {
    // Use the safe area insets
    const { top: safeTop } = useSafeAreaInsets();
    
    return (
        <View style={[styles.container, {paddingTop:safeTop}]}>
            {/* Header component */}
            <Header/>
            
            {/* Skin Quiz Component */}
            <SkinQuiz/>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
//   button: {
//     fontSize: 20,
//     textDecorationLine: 'underline',
//     color: '#fff',
//   },
});
