import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { signIn, logOut, signUpWithProfile } from '@/services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { Colors } from '@/constants/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSignUpSchema, UserSignUpForm } from '@/validation/userSchema';
import { useForm, Controller } from 'react-hook-form';
import { useFocusEffect } from 'expo-router';

export default function SettingsScreen() {
  const { top: safeTop } = useSafeAreaInsets();

  //track the user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [formMode, setFormMode] = useState<'login' | 'signup'>('login');
  const [loginError, setLoginError] = useState<string|null>(null);
  const [signUpError, setSignUpError]= useState<string|null>(null);

  //state for login/signup form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setlastName] = useState('');

useFocusEffect(
  React.useCallback(() => {
    return () => {
      // Screen is being unfocused, reset fields and errors
      setLoginError(null);
      setSignUpError(null);
      setEmail('');
      setPassword('');
      reset(); 
    };
  }, [])
);


  //Form using react hook form and zod schema - "Sign Up"
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserSignUpForm>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    mode: "onBlur", //validation runs when user leaves field
    reValidateMode: "onBlur" // re-validate
  });
    
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
    setLoginError(null);  
    try {
      await signIn(email, password);
      //clear form fields after success
      setEmail('');
      setPassword('');
    } catch (error: any) {
      //custom error message
      if (!password || !email) {
        setLoginError('Please enter both email and password');
        return;
      }
      else if (error.code === 'auth/user-not-found' 
        || error.code === 'auth/wrong-password' 
        || error.code === 'auth/invalid-email'
        || error.code === 'auth/invalid-credential'
      ) {
        setLoginError('Email or password is incorrect. Please try again.');
        setEmail('');
        setPassword('');
        return;
      } else {
        setLoginError(error.message);
        alert("An Unknown Error seems to have occured, please try again");
      }
    }
  };

    // This function is called by RHF on valid sign-up
    const onSignUpSubmit = async (data: UserSignUpForm) => {
      // data has { firstName, lastName, email, password }
      try {
        await signUpWithProfile(data.email, data.password, data.firstName, data.lastName);
        //clear the form 
        reset();
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use' ){
          setSignUpError(data.email + ' already has an account. Use another email or login.');
          reset();
        }
        else{
          alert("Signup error: " + error.message);
          reset();
        }
      }
    };

  // Handle signup
  // const handleSignup = async () => {
  //   try {
  //     await signUpWithProfile(email, password, firstName, lastName);
  //     setEmail('');
  //     setPassword('');
  //     setFirstName('');
  //     setlastName('');
  //     //router.replace("/(tabs)")
  //   } catch (error: any) {
  //     alert('Signup error: ' + error.message);
  //   }
  // };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error: any) {
      alert('Logout error: ' + error.message);
    }
  };

  const toggleToLogin = () => {
    setLoginError(null); 
    reset();           
    setFormMode("login");
  };
  
  const toggleToSignup = () => {
    setLoginError(null);
    reset();   
    setFormMode("signup");
  };
  
 //If user is logged in, show welcome + logout
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

//Otherwise (login or signup)
return (
  <View style={[styles.container, { paddingTop: safeTop }]}>
    {formMode === 'login' ? (
      //login form
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

        <View style={styles.buttonRow}>
          <Pressable style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Login</Text>
          </Pressable>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.text}>Don’t have an account?</Text>
          <Pressable style={styles.btn} onPress={toggleToSignup}>
            <Text style={styles.btnText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    ) : (
      //signup form 
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
            style={[styles.input, errors.email ? styles.inputError : null]}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}
      {signUpError && <Text style={styles.errorText}>{signUpError}</Text>}

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
    //marginBottom: 16,
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
    //padding: 10,
    //borderRadius: 4,
    //borderColor: Colors.paletteBlue,
    //borderWidth: 2,
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
    fontSize: 16,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: Colors.paletteBlue,
    padding: 10,
    borderRadius: 5,
    //width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    //marginVertical: 10,
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 4,
  },
  inputError: {
    borderColor: "red",
  },
});
