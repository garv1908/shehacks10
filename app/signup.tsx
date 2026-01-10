import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await signUp(email, password);
      router.replace('/onboarding/name');
    } catch (err) {
      alert((err as any)?.message ?? 'Signup failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Create account</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button mode="contained" onPress={handleSignup} style={styles.button}>Create</Button>
      <Button onPress={() => router.push('/login')} style={styles.link}>Already have an account</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  input: { width: '100%', marginTop: 12 },
  button: { marginTop: 16, width: '100%' },
  link: { marginTop: 8 },
});
