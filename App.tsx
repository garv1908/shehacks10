
import { ExpoRoot } from 'expo-router';
import React from 'react';
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
