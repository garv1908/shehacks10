import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';
import { useAuth } from '../../providers/AuthProvider';
import { upsertProfileForAuthUser } from '../../services/profileService';

const OPTIONS = ['Cafe', 'Library', 'Park', 'Bookstore'];

export default function Places() {
  const router = useRouter();
  const { updateUser, completeOnboarding, user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (val: string) => {
    setSelected((prev) => (prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]));
  };

  const finish = () => {
    (async () => {
      updateUser({ places: selected });
      // save profile via profileService (best-effort)
      try {
        await upsertProfileForAuthUser(user, {
          name: user?.name ?? null,
          interests: user?.interests ?? null,
          meeting_places: selected,
          last_seen: new Date(),
        });
      } catch (err) {
        console.warn('Failed to save profile', err);
      }
      completeOnboarding();
      router.replace('/');
    })();
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Where are you comfortable meeting?</Text>
      <View style={styles.list}>
        {OPTIONS.map((o) => (
          <Checkbox.Item
            key={o}
            label={o}
            status={selected.includes(o) ? 'checked' : 'unchecked'}
            onPress={() => toggle(o)}
          />
        ))}
      </View>
      <Button mode="contained" onPress={finish} style={styles.button}>Finish</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  list: { width: '100%', marginTop: 12 },
  button: { marginTop: 16, width: '100%' },
});
