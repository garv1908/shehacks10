import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Paragraph, Text } from 'react-native-paper';
import { useAuth } from '../../providers/AuthProvider';
import { upsertProfileForAuthUser } from '../../services/profileService';

export default function HomeScreen() {
  const { user, login } = useAuth();
  const { latestNotification, clearNotification } = useAuth();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const pingLocation = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Location permission not granted');
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });

      // Persist last_seen to profile only if profile exists (avoid creating incomplete rows)
      try {
        const { updateProfileIfExists } = await import('../../services/profileService');
        const updated = await updateProfileIfExists(user, { last_seen: new Date().toISOString() } as any);
        console.log('[home] updateProfileIfExists result=', updated);
      } catch (err) {
        console.warn('failed to persist last_seen', err);
      }
    } catch (err) {
      console.warn('location ping failed', err);
    } finally {
      setLoading(false);
    }
  };

  const redoOnboarding = async () => {
    if (!user) return;
      try {
      await upsertProfileForAuthUser(user, ({ needs_onboarding: true } as unknown) as any);
    } catch (err) {
      console.warn('failed to set needs_onboarding on profile', err);
    }
    // Update local auth state so routing can react
    login({ ...(user as any), needs_onboarding: true });
  };

  const sendSamplePush = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Sample Notification', body: 'This is a test push from the app.' },
        trigger: null,
      });
    } catch (err) {
      console.warn('failed to schedule notification', err);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={{ width: '90%' }}>
        <Card.Title title="Welcome" subtitle={user?.email ?? ''} />
        <Card.Content>
          <Paragraph>Use the buttons below to test location, onboarding, and notifications.</Paragraph>
          <View style={{ height: 12 }} />
          {latestNotification ? (
            <Card style={{ marginBottom: 12 }}>
              <Card.Content>
                <Text variant="titleMedium">In-app Notification</Text>
                <Paragraph>{latestNotification.request?.content?.title ?? 'Notification'}</Paragraph>
                <Paragraph>{latestNotification.request?.content?.body ?? ''}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => clearNotification?.()}>Dismiss</Button>
              </Card.Actions>
            </Card>
          ) : null}
          <Text>Location:</Text>
          <Paragraph>{location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'No ping yet'}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={pingLocation} loading={loading} disabled={!user}>Ping Location</Button>
          <Button mode="outlined" onPress={redoOnboarding} disabled={!user} style={{ marginLeft: 8 }}>Redo Onboarding</Button>
          <Button mode="text" onPress={sendSamplePush} style={{ marginLeft: 8 }}>Sample Push</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12 },
});
