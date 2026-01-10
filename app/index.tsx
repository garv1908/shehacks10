import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome{user?.name ? `, ${user.name}` : ''}!</Text>
      <Text style={styles.sub}>This is the main app screen.</Text>
      {!user ? (
        <Button mode="contained" onPress={() => router.push('/login')}>Login / Signup</Button>
      ) : (
        <Button mode="contained" onPress={() => { logout(); router.replace('/login'); }}>Logout</Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  sub: { marginVertical: 8 },
});
