import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../../providers/AuthProvider';

export default function Name() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');

  const next = () => {
    updateUser({ name });
    router.push('/onboarding/interests');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">What's your name?</Text>
      <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />
      <Button mode="contained" onPress={next} style={styles.button}>Next</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  input: { width: '100%', marginTop: 12 },
  button: { marginTop: 16, width: '100%' },
});
