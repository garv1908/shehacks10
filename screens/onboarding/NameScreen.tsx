import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

export default function NameScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">What's your name?</Text>
      <TextInput style={styles.input} placeholder="Enter your name" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  input: { width: '80%', marginTop: 16 },
});
