
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { checkNearby } from '@/services/checkNearbyService';
import { supabase } from '@/supabaseClient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '../providers/AuthProvider';


export default function MainScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pingStatus, setPingStatus] = useState<string>('');
  const [locLoading, setLocLoading] = useState(false);
  // const [showMatchScreen, setShowMatchScreen] = useState(false);
  // const [matchData, setMatchData] = useState<any>(null); // Replace 'any' with your match data type


  useEffect(() => {
    console.log("in use effect")
    if (!user) {
      console.warn("NotificationListener: No user in MainScreen useEffect");
      return;
    };
    const currentUserId = user.id;
    console.log("NotificationListener useEffect for user:", currentUserId);
    if (!currentUserId) {
      console.log("NotificationListener: No currentUserId provided");
      return;
    }

    const channel = supabase
      .channel('notifications-stream')
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          console.log("New notification for user ", currentUserId, payload);
          router.push({ pathname: '/MatchScreen', params: { data: JSON.stringify(payload.new.payload) } });
        }
      )
      .subscribe();
    console.log("NotificationListener: Subscribed to notifications channel");

    // return () => {
    //   console.log("NotificationListener: Unsubscribing from notifications channel", channel);
    //   supabase.removeChannel(channel);
    // };
  }, [user?.id]);


  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome{user?.name ? `, ${user.name}` : ''}!</ThemedText>
      <ThemedText style={styles.sub}>Ready to meet someone new?</ThemedText>
        {!user ? (
          <AppButton onPress={() => router.push('/login')}>
            Login / Signup
          </AppButton>
        ) : (
          <>
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
                  const result = await checkNearby(user.id);
                  if (result && result.data && result.data.matched_user) {
                    // Navigate to /MatchScreen (or /match) and pass matchData as JSON string param
                    router.push({ pathname: '/match-screen', params: { data: JSON.stringify(result.data) } });
                  } else {
                    setPingStatus("Nobody just yet. We'll let you know when someone is nearby!");
                  }
                } catch (err) {
                  setPingStatus(`checkNearby error: ${typeof err === 'object' && err && 'message' in err ? (err as any).message : String(err)}`);
                }
              }}
            >
              Check Nearby Now
            </AppButton>
            <AppButton inverted onPress={() => { logout(); router.replace('/login'); }}>
              Logout
            </AppButton>
            {location ? (
              <ThemedText style={{ marginTop: 12 }}>Last ping: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</ThemedText>
            ) : null}
          </>
        )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  // Removed welcome style to ensure ThemedText type="title" uses only the font style from themed-text.tsx
  sub: {
    fontSize: 18,
    color: '#e95581',
    marginBottom: 24,
    textAlign: 'center',
  },
});
