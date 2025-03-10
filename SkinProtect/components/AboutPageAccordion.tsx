import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Accordion from './Accordion'; 

const AboutPageAccordion = () => {
    const sections = [
        {
            title: 'Why Sun Protection Matters 🌞',
            content: (
                <Text>
                    🔆 90% of skin cancer cases are caused by UV exposure.
                    {'\n'}🔆 Skin cancer is the most common cancer in Ireland, with over 13,000 new cases diagnosed annually.
                    {'\n'}🔆 By 2040, these numbers are expected to double.
                    {'\n'}🔆 UV exposure not only increases skin cancer risk but also accelerates skin aging, leading to wrinkles, dark spots, and premature aging.
                    {'\n\n'}Despite these risks, many people still don’t use sunscreen regularly or know how to protect their skin effectively. That’s where we come in!
                </Text>
            ),
        },
        {
            title: 'What Skin Protect Does 🛡️',
            content: (
                <Text>
                    💡 Personalized SPF Recommendations – Based on your skin type, location, and activities.
                    {'\n'}💡 Daily Sun Protection Guidance – Reminders to reapply sunscreen based on UV levels.
                    {'\n'}💡 Educational Insights – Learn simple but effective ways to keep your skin safe.
                    {'\n'}💡 User-Friendly & Hassle-Free – No complex data, just clear, actionable advice.
                    {'\n'}
                    {'\n'}We understand your habits, struggles, and priorities, ensuring that staying protected doesn’t feel like a chore!
                </Text>
            ),
        },
        {
            title: 'Who Is This For? 🌍',
            content: (
                <Text>
                    Skin Protect is for anyone who wants to take care of their skin—whether you’re a beach lover, an outdoor adventurer, or just someone who spends time in the sun daily.
                    {'\n\n'}We know sun protection isn’t always a priority, so we designed Skin Protect to fit into your daily routine seamlessly!
                    {'\n\n'}No matter your lifestyle, we’ve got you covered!

                </Text>
            ),
        },
        {
            title: 'Start Protecting Your Skin Now! ⏳',
            content: (
                <Text>
                    Sun safety is easy when you have the right tools. Use Skin Protect to build smarter sun habits and keep your skin healthy for years to come.
                    {'\n\n'}✅ Go back to the home screen to get your SPF recommendation now!
                </Text>
            ),
        },
    ];

    return (
        <View style={styles.container}>
            {sections.map((section, index) => (
                <Accordion key={index} title={section.title}>
                    {section.content}
                </Accordion>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
});

export default AboutPageAccordion;
