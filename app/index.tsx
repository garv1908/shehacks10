import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Text } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';
import { SUPABASE_ANON_KEY } from '../secrets';
import { upsertProfileForAuthUser } from '../services/profileService';

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  // Manual check button will call the edge function; polling removed.

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
              const point = `POINT(${longitude} ${latitude})`;
              const res = await updateProfileIfExists(user, { last_seen: new Date().toISOString(), location: point } as any);
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
            if (!user) return;
            setPingStatus('Calling checkNearby...');
            try {
              const { checkNearby } = await import('../services/checkNearbyService');
              console.log('[app] calling checkNearby for user.id=', user.id);
              const { data, error } = await checkNearby(user.id);
              if (error) {
                console.error('[checkNearby] error', error);
                setPingStatus(`checkNearby error: ${error.message}`);
              } else {
                console.log('[checkNearby] response data', data);
                setPingStatus('checkNearby: success (see console)');
              }
            } catch (err) {
              console.error('[checkNearby] request failed', err);
              setPingStatus(`checkNearby error: ${err?.message ?? String(err)}`);
            }
          }}>Check Nearby Now</Button>
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

// Poll the edge function every 30s while this component is mounted.
// It POSTs the current user's id to the function and logs the response.
// The interval is cleaned up on unmount.
const POLL_INTERVAL_MS = 30_000;

function useCheckNearbyPolling(userId?: string | null) {
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const callFn = async () => {
      try {
        console.log('[checkNearby] calling edge function for user', userId);
        const res = await fetch('https://mlwaexcuqgskljwtanij.supabase.co/functions/v1/checkNearby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ current_user_id: userId }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.warn('[checkNearby] non-OK response', res.status, text);
          return;
        }

        const data = await res.json();
        if (!cancelled) console.log('[checkNearby] result', data);
      } catch (err) {
        if (!cancelled) console.error('[checkNearby] error', err);
      }
    };

    // call immediately, then every POLL_INTERVAL_MS
    callFn();
    const id = setInterval(callFn, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [userId]);
}

// polling hook defined above; it's invoked from inside the component

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  sub: { marginVertical: 8 },
});
