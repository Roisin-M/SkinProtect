import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import AboutPageAccordion from '@/components/AboutPageAccordion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const { top: safeTop } = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <Text style={styles.heading1}>About Skin Protect</Text>
      <Text style={styles.subheading}>Your skin is your shield, and we’re here to help you keep it safe.</Text>
      <ScrollView>
        <AboutPageAccordion />
      </ScrollView>
      {/* <Text style={styles.text}>About Skin Protect</Text>
      <Text style={styles.text}>Your skin is your shield, and we’re here to help you keep it safe. Skin Protect is designed to make sun protection simple, especially for young people who may not realize the risks of UV exposure.</Text>
      
      <Text style={styles.text}>Why Sun Protection Matters 🌞</Text>
      <ul style={styles.list}>
        <li>🔆 90% of skin cancer cases are caused by UV exposure.</li>
        <li>🔆 Skin cancer is the most common cancer in Ireland, with over 13,000 new cases diagnosed annually.</li>
        <li>🔆 By 2040, these numbers are expected to double.</li>
        <li>🔆 UV exposure not only increases skin cancer risk but also accelerates skin aging, leading to wrinkles, dark spots, and premature aging.</li>
      </ul>
      <Text style={styles.text}>Despite these risks, many people still don’t use sunscreen regularly or know how to protect their skin effectively. That’s where we come in!</Text>

      <Text style={styles.text}>What Skin Protect Does 🛡️</Text>
      <ul style={styles.list}>
        <li>💡 Personalized SPF Recommendations – Based on your skin type, location, and activities.</li>
        <li>💡 Daily Sun Protection Guidance – Reminders to reapply sunscreen based on UV levels.</li>
        <li>💡 Educational Insights – Learn simple but effective ways to keep your skin safe.</li>
        <li>💡 User-Friendly & Hassle-Free – No complex data, just clear, actionable advice.</li>
      </ul>

      <Text style={styles.text}>How We Built Skin Protect 🔍</Text>
      <Text style={styles.text}>To ensure Skin Protect truly helps young people, we conducted extensive research, including:</Text>
      <ul style={styles.list}>
        <li>✅ Interviews & user testing to understand real struggles with sun protection.</li>
        <li>✅ Analyzing current tools to see what works and what doesn’t.</li>
        <li>✅ Applying best practices to make skin protection easy, accessible, and effective.</li>
      </ul>
      <Text style={styles.text}>We know sun protection isn’t always a priority, so we designed Skin Protect to fit into your daily routine seamlessly!</Text>

      <Text style={styles.text}>Who Is This For? 🌍</Text>
      <Text style={styles.text}>Skin Protect is for anyone who wants to take care of their skin—whether you’re a beach lover, an outdoor adventurer, or just someone who spends time in the sun daily.</Text>
      <Text style={styles.text}>No matter your lifestyle, we’ve got you covered!</Text>
      
      <Text style={styles.text}>Start Protecting Your Skin Today! ⏳</Text>
      <Text style={styles.text}>Sun safety is easy when you have the right tools. Use Skin Protect to build smarter sun habits and keep your skin healthy for years to come.</Text>
      <Text style={styles.text}>✅ Go back to the home screen to get your SPF recommendation now!</Text> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#023047',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  heading1: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  subheading: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    padding: 20,

  },
  text: {
    color: '#fff',
  },
});
