import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      // signIn will route via auth state; check user
      router.replace('/');
    } catch (err) {
      alert((err as any)?.message ?? 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Login</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>Sign in</Button>
      <Button onPress={() => router.push('/signup')} style={styles.link}>Create account</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  input: { width: '100%', marginTop: 12 },
  button: { marginTop: 16, width: '100%' },
  link: { marginTop: 8 },
});
