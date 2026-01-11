
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppButton } from '@/components/ui/app-button';
import { MatchScreen } from '@/screens/main/MatchScreen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '../providers/AuthProvider';
import { checkNearby } from '@/services/checkNearbyService';


export default function MainScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pingStatus, setPingStatus] = useState<string>('');
  const [locLoading, setLocLoading] = useState(false);
  const [showMatchScreen, setShowMatchScreen] = useState(false);
  const [matchData, setMatchData] = useState<any>(null); // Replace 'any' with your match data type

  if (showMatchScreen && matchData) {
    return <MatchScreen data={matchData} onBack={() => setShowMatchScreen(false)} />;
  }

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.welcome}>Welcome{user?.name ? `, ${user.name}` : ''}!</ThemedText>
        <ThemedText style={styles.sub}>Ready to meet someone new?</ThemedText>
        {!user ? (
          <AppButton onPress={() => router.push('/login')}>
            Login / Signup
          </AppButton>
        ) : (
          <>
            <AppButton inverted onPress={() => { logout(); router.replace('/login'); }}>
              Logout
            </AppButton>
            <AppButton
              mode="outlined"
              onPress={async () => {
                console.log('[app] pinging location');
                setPingStatus('Starting location ping...');
                if (!user) {
                  setPingStatus('No authenticated user');
                  return;
                }
                setLocLoading(true);
                try {
                  setPingStatus('Requesting permission');
                  const { status } = await Location.requestForegroundPermissionsAsync();
                  console.log('[app] location permission status=', status);
                  setPingStatus(`Permission: ${status}`);
                  if (status !== 'granted') throw new Error('Location permission not granted');

                  setPingStatus('Getting current position');
                  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                  const { latitude, longitude } = pos.coords;
                  setLocation({ latitude, longitude });
                  // TODO: updateProfileIfExists logic
                } catch (err: any) {
                  setPingStatus(`Error: ${err?.message ?? String(err)}`);
                } finally {
                  setLocLoading(false);
                }
              }}
              loading={locLoading}
            >
              Ping Location
            </AppButton>
            <AppButton
              mode="outlined"
              onPress={async () => {
                if (!user) return;
                setPingStatus('Calling checkNearby...');
                try {
                  // Call checkNearby and handle match
                  checkNearby(user.id)
                    .then((result) => {
                      if (result && result.data && result.data.matched_user) {
                        setMatchData(result.data);
                        setShowMatchScreen(true);
                      } else {
                        setPingStatus('checkNearby completed (no match)');
                      }
                    });
                } catch (err) {
                  setPingStatus(`checkNearby error: ${typeof err === 'object' && err && 'message' in err ? (err as any).message : String(err)}`);
                }
              }}
            >
              Check Nearby Now
            </AppButton>
            <AppButton
              mode="outlined"
              onPress={async () => {
                try {
                  await Notifications.scheduleNotificationAsync({ content: { title: 'Test', body: 'Sample in-app notification' }, trigger: null });
                } catch (err) {
                  // Silently ignore push notification errors
                }
              }}
            >
              Send Test Notification
            </AppButton>
            <AppButton
              mode="contained"
              onPress={async () => {
                if (!user) return;
                try {
                  // TODO: upsertProfileForAuthUser logic
                } catch (err) {
                  // console.warn('failed to set needs_onboarding on profile', err);
                }
                router.push('/onboarding/name');
              }}
            >
              Start Onboarding
            </AppButton>
            {location ? (
              <ThemedText style={{ marginTop: 12 }}>Last ping: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</ThemedText>
            ) : null}
          </>
        )}
      </ThemedView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  sub: {
    fontSize: 18,
    color: '#e95581',
    marginBottom: 24,
    textAlign: 'center',
  },
});
