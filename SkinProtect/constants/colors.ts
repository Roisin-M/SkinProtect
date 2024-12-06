/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  background: '#F4F4F4',
  tint: '#FF4C4C',
  tabIconDefault: '#687076',
  tabIconSelected: '#FF4C4C',
  white: '#fff',
  black: '#333',
  darkGrey: '#666',
  lightGrey: '#999',
  softText: '#555',
  orange:'#fe5a1d',
  blue: '#1974d2',
  darkBackground: '#25292e',
  red:'#FF0000',

    // UV-specific colors based on risk level
    uvLow: '#4CAF50', // Green (Low risk)
    uvModerate: '#FFC107', // Yellow (Moderate risk)
    uvHigh: '#FF5722', // Orange (High risk)
    uvVeryHigh: '#F44336', // Red (Very High risk)
    uvExtreme: '#9C27B0', // Purple (Extreme risk)
};
