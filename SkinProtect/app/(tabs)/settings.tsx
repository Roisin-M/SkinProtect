import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { signIn, signUp, logOut, signUpWithProfile } from '@/services/authService';
import { router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { Colors } from '@/constants/colors';

export default function SettingsScreen() {
  const { top: safeTop } = useSafeAreaInsets();

  //track the current user (Firebase user or null)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  // login or signup mode?
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  //state for login/signup form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');
    
  

  //listen for auth state changes
  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      setCurrentUser(user);
      if(user){
        //if user is logged in, fetch their firestore doc
        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);
        if(snapshot.exists()){
          setProfile(snapshot.data());
        } else{
          setProfile(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  //handle login
  const handleLogin = async () => {
    try {
      await signIn(email, password);
      //clear form fields after success
      setEmail('');
      setPassword('');
    } catch (error: any) {
      alert('Login error: ' + error.message);
    }
  };

  // Handle signup
  const handleSignup = async () => {
    try {
      await signUpWithProfile(email, password, firstName, lastName);
      setEmail('');
      setPassword('');
      setFirstName('');
      setlastName('');
      //router.replace("/(tabs)")
    } catch (error: any) {
      alert('Signup error: ' + error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error: any) {
      alert('Logout error: ' + error.message);
    }
  };
  
 //** If user is logged in, show welcome + logout */
 if (currentUser) {
  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <View style={styles.settingsContainer}>
        <Text style={styles.btnText}>
          Welcome {profile?.firstName} {profile?.lastName}!
        </Text>
            <Pressable style={styles.btn} onPress={handleLogout}>
              <Text style={styles.btnText}>Logout</Text>
            </Pressable>
      </View>
    </View>
  );
}

//** Otherwise (login or signup) */
return (
  <View style={[styles.container, { paddingTop: safeTop }]}>
    {mode === 'login' ? (
      //** LOGIN FORM */
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />

        <View style={styles.buttonRow}>
          <Pressable style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Login</Text>
          </Pressable>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.text}>Don’t have an account?</Text>
          <Pressable style={styles.btn} onPress={() => setMode('signup')}>
            <Text style={styles.btnText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    ) : (
      //** SIGNUP FORM */
      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          onChangeText={setFirstName}
          value={firstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          onChangeText={setlastName}
          value={lastName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />

        <View style={styles.buttonRow}>
          <Pressable style={styles.btn} onPress={handleSignup}>
            <Text style={styles.btnText}>Sign Up</Text>
          </Pressable>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.text}>Already have an account?</Text>
          <Pressable style={styles.btn} onPress={() => setMode('login')}>
            <Text style={styles.btnText}>Login</Text>
          </Pressable>
        </View>
      </View>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.prussianBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.textDark,
    fontSize: 18,
    marginBottom: 16,
  },
  formContainer: {
    marginTop: 10,
    backgroundColor: Colors.textLight,
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  label: {
    color: Colors.textDark,
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.textLight,
    marginVertical: 8,
    padding: 10,
    borderRadius: 4,
    borderColor: Colors.paletteBlue,
    borderWidth: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  loggedInContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  settingsContainer:{
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: Colors.seenThroughBG,
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  btnText: {
    color: Colors.textLight,
    fontSize: 20,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: Colors.paletteBlue,
    padding: 10,
    borderRadius: 5,
    width: '40%',
    justifyContent: 'center',
    marginHorizontal: 2,
    marginVertical: 10,
  },
});
