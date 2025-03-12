import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { fetchUserProfile } from '@/services/profileService';


export default function ProfileHeader () {
    const [uid, setUid] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string>('');
  
    //get firstName/lastName from fetched profile service
    function updateDisplayNameFromProfile(profileData: any) {
      if (profileData) {
        const { firstName, lastName } = profileData;
        const first = firstName ?? '';
        const last = lastName ?? '';
        setDisplayName(`${first} ${last}`.trim());
      } else {
        setDisplayName('');
      }
    }

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUid(user.uid);
        } else {
          setUid(null);
          setDisplayName('');
        }
      });
      return () => unsubscribe();
    }, []);
  
    //Whenever uid changes, fetch Firestore profile
    useEffect(() => {
      async function loadProfile() {
        if (!uid) {
          // user is logged out, skip
          return;
        }
        try {
          const profileData = await fetchUserProfile();
          updateDisplayNameFromProfile(profileData);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setDisplayName('');
        }
      }
  
      loadProfile();
    }, [uid]);
  
    return (
      <View style={styles.container}>
        <Ionicons name="person-circle" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.text}>{displayName || 'Guest'}</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 6,
    },
    text: {
      color: Colors.textLight,
      fontSize: 18,
      fontWeight: '600',
    },
  });