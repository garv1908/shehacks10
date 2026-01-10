import * as Location from 'expo-location';
import { useEffect, useRef } from 'react';
import { upsertProfileForAuthUser } from '../services/profileService';

// Updates `last_seen` in profile periodically while app is foregrounded.
export default function useLocationUpdater(user: any) {
  const lastUpdateRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;

    let subscriber: Location.LocationSubscription | null = null;
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        // Watch position; update last_seen at most once every 5 minutes
        subscriber = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 30_000, distanceInterval: 50 },
          async (loc) => {
            if (!mounted) return;
            const now = Date.now();
            const last = lastUpdateRef.current ?? 0;
            const FIVE_MIN = 5 * 60 * 1000;
            if (now - last < FIVE_MIN) return;
            lastUpdateRef.current = now;
            try {
              await upsertProfileForAuthUser(user, { last_seen: new Date().toISOString() });
            } catch (err) {
              console.warn('failed to update last_seen', err);
            }
          }
        );
      } catch (err) {
        console.warn('location watcher failed', err);
      }
    })();

    return () => {
      mounted = false;
      if (subscriber) subscriber.remove();
    };
  }, [user]);
}
