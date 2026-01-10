import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';

const interests = ['Books', 'Coffee', 'Fitness', 'Music', 'Art'];

export default function InterestsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Select your interests</Text>
      <View style={styles.list}>
        {interests.map((interest) => (
          <View key={interest} style={styles.item}>
            <Checkbox.Android status="unchecked" />
            <Text>{interest}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { marginTop: 16 },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
});
