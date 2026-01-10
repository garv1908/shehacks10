import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Paragraph } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { upsertProfileForAuthUser } from '../services/profileService';

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome{user?.name ? `, ${user.name}` : ''}!</Text>
      <Text style={styles.sub}>This is the main app screen.</Text>
      {!user ? (
        <Button mode="contained" onPress={() => router.push('/login')}>Login / Signup</Button>
      ) : (
        <>
          <Button mode="contained" onPress={() => { logout(); router.replace('/login'); }}>Logout</Button>
          <View style={{ height: 12 }} />
          <Button mode="outlined" onPress={async () => {
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
              console.log('[app] got location', { latitude, longitude });
              setLocation({ latitude, longitude });

              setPingStatus('Updating profile (if exists)');
              const { updateProfileIfExists } = await import('../services/profileService');
              console.log('[app] updating last_seen for user.id=', user?.id);
              const res = await updateProfileIfExists(user, { last_seen: new Date().toISOString() } as any);
              console.log('[app] update last_seen result=', res);
              setPingStatus(res ? 'Profile updated' : 'Profile did not exist; no update performed');
            } catch (err: any) {
              console.error('[app] location ping failed', err);
              setPingStatus(`Error: ${err?.message ?? String(err)}`);
            } finally {
              setLocLoading(false);
            }
          }} loading={locLoading}>Ping Location</Button>

          <View style={{ height: 8 }} />
          <Button mode="outlined" onPress={async () => {
            console.log('[app] scheduling test notification');
            try {
              const id = await Notifications.scheduleNotificationAsync({ content: { title: 'Test', body: 'Sample in-app notification' }, trigger: null });
              console.log('[app] scheduled notification id=', id);
            } catch (err) {
              console.error('[app] failed to schedule notification', err);
            }
          }}>Send Test Notification</Button>

          <View style={{ height: 8 }} />
          <Button mode="text" onPress={async () => {
            if (!user) return;
            try {
              await upsertProfileForAuthUser(user, ({ needs_onboarding: true } as unknown) as any);
            } catch (err) {
              console.warn('failed to set needs_onboarding on profile', err);
            }
            router.push('/onboarding/name');
          }}>Start Onboarding</Button>

          {location ? (
            <Paragraph style={{ marginTop: 12 }}>Last ping: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</Paragraph>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  sub: { marginVertical: 8 },
});
