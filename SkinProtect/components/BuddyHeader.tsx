import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Image, TouchableOpacity, Text, Animated, StyleSheet, ScrollView , Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';

// Define the ref interface
export interface BuddyHeaderRef {
    updateMessage: (newMessage: string, isInfoMessage?: boolean) => void;
    handleClosePopup: () => void;
}

const BuddyHeader = forwardRef<BuddyHeaderRef>((props, ref) => {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const slideAnim = new Animated.Value(-20); // Start off-screen

  const { height: screenHeight } = Dimensions.get('window');
  const buddyPopupHeight = 200; //max height of the popup
  //const popupTopPosition = screenHeight - buddyPopupHeight < 20 ? screenHeight - buddyPopupHeight - 20 : 20; 

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showPopup ? 0 : -buddyPopupHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showPopup]);

  const handleBuddyPress = () => {
      setMessage("If you have any questions, click the little yellow question marks to get explanations or check out the About page for general info.");
      setShowInfoMessage(true);
      setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowInfoMessage(false);
  };

  const updateMessage = (newMessage: string, isInfoMessage: boolean = false) => {
    setMessage(newMessage);
    setShowInfoMessage(isInfoMessage);
    setShowPopup(true);
  };

  // Expose the updateMessage method to the ref
  useImperativeHandle(ref, () => ({
    updateMessage,
    handleClosePopup,
  }));


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBuddyPress}>
        <Image source={require('@/assets/images/buddyTanner.png')} style={styles.buddyImage} />
      </TouchableOpacity>
      {showPopup && (
        //zIndex here so that the message is in the foreground and all components stay behind it
        <Animated.View style={[styles.popup, { transform: [{ translateY: slideAnim }], top: 10, zIndex: 1000 }]}> 
          <View style={styles.speechBubble}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.popupText}>{message}</Text>
            </ScrollView>
              <TouchableOpacity onPress={handleClosePopup}>
                <Text style={styles.closeText}>Got it!</Text>
              </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    //position: 'absolute',
    //top: 20,
    //marginTop: 40,
    //left: 20,
  },
  buddyImage: {
    width: 70,
    height: 70,
    borderRadius: 25,
  },
  popup: {
    position: 'absolute',
    //marginTop: 0,
    left: 80,
    zIndex: 1000,
  },
  speechBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: 250,
    maxHeight: 200,
    position: 'relative',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  popupText: {
    fontSize: 16,
    color: Colors.black,
  },
  closeText: {
    marginTop: 10,
    color: Colors.blue,
    fontWeight: 'bold',
  },
});

export default BuddyHeader;