import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { upsertProfileForAuthUser } from '../services/profileService';

export default function usePushToken(user: any) {
  useEffect(() => {
    if (!user) return;

    let mounted = true;

    (async () => {
      try {
        // In Expo Go on Android, remote push tokens are not available — skip token registration
        const isExpoGo = Constants.appOwnership === 'expo';

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') return;

        if (!isExpoGo) {
          const tokenData = await Notifications.getExpoPushTokenAsync();
          const token = tokenData.data;
          if (mounted && token) {
            await upsertProfileForAuthUser(user, { expo_push_token: token } as any);
          }
        } else {
          // Running in Expo Go — skip token registration. We still set Android channel.
        }

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }
      } catch (err) {
        console.warn('Unable to get push token', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user]);
}
