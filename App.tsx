
import { ExpoRoot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './providers/AuthProvider';
import NotificationListener from './hooks/notificationListener';
import { useAuth } from './providers/AuthProvider';

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


function AppInner(props: any) {
  const { user } = useAuth();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'ImperialScript-Regular': require('./assets/fonts/ImperialScript-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;
  if (!user) { throw new Error('User not authenticated in AppInner'); }
  return (
    <>
      <NotificationListener currentUserId={user?.id} />
      <ExpoRoot {...props} />
    </>
  );
}

export default function App(props: any) {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppInner {...props}/>
        <ExpoRoot {...props} />
      </AuthProvider>
    </PaperProvider>
  );
}
