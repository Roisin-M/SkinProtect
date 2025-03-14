import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ProgressBarProps {
    duration: number; //duration in seconds (7200 for 2 hours)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const animatedWidth = new Animated.Value(100); //start at full 

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime((prev) => {
                if (prev < duration) {
                    return prev + 1;
                } else {
                    clearInterval(timer);
                    alert("Time to reapply SPF!");
                    return prev;
                }
            });
        }, 1000); //update every second

        return () => clearInterval(timer); //cleanup on unmount
    }, [duration]);

    useEffect(() => {
        const remainingTime = duration - elapsedTime;
        const percentage = (remainingTime / duration) * 100;

        Animated.timing(animatedWidth, {
            toValue: percentage,
            duration: 1000, // Change duration for animation speed
            useNativeDriver: false,
        }).start();
    }, [elapsedTime, duration]);

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View
                style={[styles.progressBarFill, { width: animatedWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                }) }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarContainer: {
        width: '100%',
        backgroundColor: '#eee',
    },
    progressBarFill: {
        height: 30,
        backgroundColor: '#76c7c0',
    },
});

export default ProgressBar;
