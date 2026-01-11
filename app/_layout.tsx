import { Colors } from '@/constants/theme';
import { Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../providers/AuthProvider';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded] = useFonts({
    'ImperialScript-Regular': require('../assets/fonts/ImperialScript-Regular.ttf'),
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // FORCE LIGHT MODE
  const isDark = false; 

  const baseTheme = MD3LightTheme;
  const customColors = Colors.light;

  const appTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: customColors.tint,
      onPrimary: customColors.background, // Text on primary
      background: customColors.background,
      surface: customColors.surface,
      onSurface: customColors.text,
      text: customColors.text,
      elevation: {
        ...baseTheme.colors.elevation,
        level1: customColors.elevation,
      }
    },
  };

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={appTheme}>
      <AuthProvider>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: customColors.background } }} />
      </AuthProvider>
    </PaperProvider>
  );
}
