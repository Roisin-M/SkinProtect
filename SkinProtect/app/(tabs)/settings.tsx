import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { signIn, signUp, logOut } from '@/services/authService';

export default function SettingsScreen() {
  const { top: safeTop } = useSafeAreaInsets();

  //track the current user (Firebase user or null)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  //state for login/signup form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //listen for auth state changes
  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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
      await signUp(email, password);
      setEmail('');
      setPassword('');
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
  
  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      {/* Existing Settings heading */}
      {/* <Text style={styles.text}>Settings screen</Text> */}

      {currentUser ? (
        // If logged in, show user email + logout button
        <View style={styles.loggedInContainer}>
          <Text style={styles.text}>Logged in as: {currentUser.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        // If not logged in, show login/signup form
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
            onChangeText={setPassword}
            value={password}
          />

          <View style={styles.buttonRow}>
            <Button title="Login" onPress={handleLogin} />
            <Button title="Signup" onPress={handleSignup} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#023047',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
  },
  formContainer: {
    marginTop: 10,
    backgroundColor: '#323644',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  label: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 10,
    borderRadius: 4,
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
});
