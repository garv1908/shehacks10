import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';
import { useAuth } from '../../providers/AuthProvider';

const OPTIONS = ['Books', 'Coffee', 'Fitness', 'Music', 'Art'];

export default function Interests() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [selected, setSelected] = useState<string[]>(user?.interests ?? []);

  const toggle = (val: string) => {
    setSelected((prev) => (prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]));
  };

  const next = () => {
    updateUser({ interests: selected });
    router.push('/onboarding/places');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Select your interests</Text>
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
      <Button mode="contained" onPress={next} style={styles.button}>Next</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  list: { width: '100%', marginTop: 12 },
  button: { marginTop: 16, width: '100%' },
});
