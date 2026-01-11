/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Pink palette
const tintColorLight = '#ff4f9a'; // Vibrant pink
const tintColorDark = '#ffb6d5'; // Soft pink for dark mode

export const Colors = {
  light: {
    text: '#e95581', // user-preferred pink
    background: '#fce4ec', // soft blush pink
    tint: '#f48fb1', // soft highlight pink
    icon: '#f06292', // accent pink
    tabIconDefault: '#f8bbd0', // muted pink for inactive
    tabIconSelected: '#f06292', // accent pink for active
  },
  dark: {
    text: '#e95581', // user-preferred pink
    background: '#31102b', // deep muted plum
    tint: '#f06292', // accent pink
    icon: '#f48fb1', // soft highlight pink
    tabIconDefault: '#7c4d64', // muted plum for inactive
    tabIconSelected: '#f48fb1', // soft highlight pink for active
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
