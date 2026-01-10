import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function SignupScreen() {
  const navigation = useNavigation() as any;
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Signup</Text>
      {/* TODO: Add email/password fields and signup logic */}
      <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Login')}>Go to Login</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { marginTop: 16 },
});
