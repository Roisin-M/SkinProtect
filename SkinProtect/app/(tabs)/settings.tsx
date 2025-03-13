import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../firebaseConfig';
import { signIn, logOut, signUpWithProfile } from '@/services/authService';
import { Colors } from '@/constants/colors';
import { userSignUpSchema, UserSignUpForm } from '@/validation/userSchema';
import { updateUserSkinType } from '@/services/profileService';

export default function SettingsScreen() {
  const { top: safeTop } = useSafeAreaInsets();

  // Track user & form mode
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [formMode, setFormMode] = useState<'login' | 'signup'>('login');

  // Error states
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Email/password states for login only
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // React Hook Form for sign-up
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserSignUpForm>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // Reset fields on screen unmount
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setLoginError(null);
        setSignUpError(null);
        setEmail('');
        setPassword('');
        reset();
      };
    }, [reset])
  );

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) setProfile(snapshot.data());
        else setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle login
  const handleLogin = async () => {
    setLoginError(null);
    try {
      // Check for missing fields
      if (!email || !password) {
        setLoginError('Please enter both email and password');
        return;
      }
      await signIn(email, password);
      setEmail('');
      setPassword('');

    } catch (error: any) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/invalid-credential'
      ) {
        setLoginError('Email or password is incorrect. Please try again.');
        setEmail('');
        setPassword('');
      } else {
        setLoginError(error.message);
        alert('An Unknown Error seems to have occurred. Please try again.');
      }
    }
  };

  // Handle sign-up using React Hook Form
  const onSignUpSubmit = async (data: UserSignUpForm) => {
    try {
      await signUpWithProfile(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );
      reset();
      setSignUpError(null);
      const storedSkinType = await AsyncStorage.getItem('skinType');
      //update user's skintype in db with ^
      if(storedSkinType){
        await updateUserSkinType(storedSkinType);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setSignUpError(
          data.email + ' already has an account. Use another email or login.'
        );
        reset();
      } else {
        alert('Signup error: ' + error.message);
        reset();
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error: any) {
      alert('Logout error: ' + error.message);
    }
  };

  // Switch forms
  const toggleToLogin = () => {
    setLoginError(null);
    setSignUpError(null);
    reset();
    setFormMode('login');
  };
  const toggleToSignup = () => {
    setLoginError(null);
    setSignUpError(null);
    reset();
    setFormMode('signup');
  };

  // If user is logged in, greet + logout
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

  // Otherwise show login or signup
  return (
    <View
      style={[styles.container, { paddingTop: safeTop }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {formMode === 'login' ? (
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

            {loginError && <Text style={styles.errorText}>{loginError}</Text>}

            <Pressable style={styles.btn} onPress={handleLogin}>
              <Text style={styles.btnText}>Login</Text>
            </Pressable>

            <View style={styles.switchContainer}>
              <Text style={styles.text}>Don’t have an account?</Text>
              <Pressable style={styles.btn} onPress={toggleToSignup}>
                <Text style={styles.btnText}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>First Name</Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter first name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={[
                    styles.input,
                    errors.firstName ? styles.inputError : null,
                  ]}
                />
              )}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName.message}</Text>
            )}

            <Text style={styles.label}>Last Name</Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter last name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={[
                    styles.input,
                    errors.lastName ? styles.inputError : null,
                  ]}
                />
              )}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName.message}</Text>
            )}

            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={[
                    styles.input,
                    errors.email ? styles.inputError : null,
                  ]}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
            {signUpError && (
              <Text style={styles.errorText}>{signUpError}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter password"
                  secureTextEntry
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={[
                    styles.input,
                    errors.password ? styles.inputError : null,
                  ]}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <Pressable
              style={styles.btn}
              onPress={handleSubmit(onSignUpSubmit)}
            >
              <Text style={styles.btnText}>Sign Up</Text>
            </Pressable>

            <View style={styles.switchContainer}>
              <Text style={styles.text}>Already have an account?</Text>
              <Pressable style={styles.btn} onPress={toggleToLogin}>
                <Text style={styles.btnText}>Login</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.prussianBlue,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  scrollContent:{
    padding:16,
  },
  text: {
    color: Colors.textDark,
    fontSize: 18,
  },
  formContainer: {
    marginTop: '20%',
    backgroundColor: Colors.textLight,
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignSelf: 'center', // center horizontally if you want
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 4,
  },
  btn: {
    backgroundColor: Colors.paletteBlue,
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: 'center',
  },
  btnText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  switchContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  settingsContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: Colors.seenThroughBG,
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignSelf: 'center',
  },
});
