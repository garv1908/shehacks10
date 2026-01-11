import { Stack } from 'expo-router';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../providers/AuthProvider';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F7C6E0',
    accent: '#BFA2F7',
    background: '#FFF8F3',
    surface: '#FFF8F3',
    text: '#3D2247',
  },
};



export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </PaperProvider>
  );
}
