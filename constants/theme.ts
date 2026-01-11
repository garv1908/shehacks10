/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


// Pink palette
const tintColorLight = '#ff4f9a'; // Vibrant pink
const tintColorDark = '#ffb6d5'; // Soft pink for dark mode

export const Colors = {
  light: {
    text: '#2D0015', // Deep Charcoal/Plum for high contrast text
    background: '#FFF0F5', // Soft Rose White
    tint: '#E91E63', // Vibrant Raspberry
    icon: '#D81B60',
    tabIconDefault: '#F8BBD0',
    tabIconSelected: '#E91E63',
    surface: '#FFFFFF',
    elevation: '#FCE4EC',
  },
  dark: {
    text: '#FCE4EC', // Soft Pink White
    background: '#2D0015', // Deep Plum
    tint: '#FF4081', // Hot Pink
    icon: '#FF80AB',
    tabIconDefault: '#880E4F',
    tabIconSelected: '#FF4081',
    surface: '#4A0E2E',
    elevation: '#5C123B',
  },
};

export const Fonts = {
  sans: 'PlusJakartaSans-Regular',
  serif: 'Outfit-Regular', // Using Outfit as the "serif" slot for headings effectively
  rounded: 'PlusJakartaSans-Medium',
  mono: 'monospace',
};
